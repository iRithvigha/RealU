// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');  
const { Server } = require('socket.io');

require('dotenv').config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://user:user@realu.pksmy.mongodb.net/?retryWrites=true&w=majority&appName=realu';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB 🚀'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    interests: [{ type: String, trim: true }],
    kycVerified: { type: Boolean, default: false },
    reclaimProofs: { type: mongoose.Schema.Types.Mixed, default: null },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
    matchScore: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const queueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interests: [String],
    createdAt: { type: Date, default: Date.now }
});

// const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Match = mongoose.model('Match', matchSchema);
const Queue = mongoose.model('Queue', queueSchema);

// Matching Queue Management
const matchingQueue = new Map(); // userId -> { socketId, interests }

// Socket.IO Connection Management
const userSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

// Socket.IO Event Handlers
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // User joins matching queue
    socket.on('join_queue', async (userData) => {
        try {
            const { userId, interests } = userData;
            console.log('User joining queue:', userId);

            // Add to queue in MongoDB
            await Queue.create({ userId, interests });
            
            // Add to in-memory queue
            matchingQueue.set(userId, { socketId: socket.id, interests });
            userSockets.set(userId, socket.id);
            socketUsers.set(socket.id, userId);

            // Try to find a match
            await findMatch(userId);
        } catch (error) {
            console.error('Error joining queue:', error);
            socket.emit('queue_error', { message: 'Failed to join queue' });
        }
    });

    // Handle private messages
    socket.on('private_message', async ({ senderId, receiverId, content }) => {
        try {
            // Save message to database
            const message = await Message.create({
                senderId,
                receiverId,
                content
            });

            // Send to receiver if online
            const receiverSocket = userSockets.get(receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit('receive_message', {
                    messageId: message._id,
                    senderId,
                    content,
                    timestamp: message.timestamp
                });
            }

            // Confirm to sender
            socket.emit('message_sent', {
                messageId: message._id,
                timestamp: message.timestamp
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message_error', { message: 'Failed to send message' });
        }
    });

    // Handle typing status
    socket.on('typing', ({ senderId, receiverId }) => {
        const receiverSocket = userSockets.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('user_typing', { senderId });
        }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        const userId = socketUsers.get(socket.id);
        if (userId) {
            // Remove from queues and maps
            matchingQueue.delete(userId);
            userSockets.delete(userId);
            socketUsers.delete(socket.id);

            // Update user status in database
            await User.findByIdAndUpdate(userId, {
                isOnline: false,
                lastActive: new Date()
            });

            // Remove from matching queue in MongoDB
            await Queue.deleteOne({ userId });
        }
    });
});

// Matching Algorithm
async function findMatch(userId) {
    const userInQueue = matchingQueue.get(userId);
    if (!userInQueue) return;

    const userInterests = userInQueue.interests;
    let bestMatch = null;
    let highestScore = 0;

    // Look for matches in the queue
    for (const [potentialMatchId, potentialMatch] of matchingQueue) {
        if (potentialMatchId !== userId) {
            const commonInterests = userInterests.filter(interest =>
                potentialMatch.interests.includes(interest)
            );

            const score = (commonInterests.length / Math.max(userInterests.length, potentialMatch.interests.length)) * 100;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = {
                    userId: potentialMatchId,
                    socketId: potentialMatch.socketId,
                    score
                };
            }
        }
    }

    // If found a good match (score > 30%)
    if (bestMatch && bestMatch.score > 30) {
        // Create match in database
        const match = await Match.create({
            users: [userId, bestMatch.userId],
            status: 'active',
            matchScore: bestMatch.score
        });

        // Remove both users from queues
        matchingQueue.delete(userId);
        matchingQueue.delete(bestMatch.userId);
        await Queue.deleteMany({ userId: { $in: [userId, bestMatch.userId] } });

        // Notify both users
        io.to(userInQueue.socketId).emit('match_found', {
            matchId: match._id,
            partnerId: bestMatch.userId,
            score: bestMatch.score
        });

        io.to(bestMatch.socketId).emit('match_found', {
            matchId: match._id,
            partnerId: userId,
            score: bestMatch.score
        });
    }
}

// REST API Routes
app.post('/api/users', async (req, res) => {
    try {
        const { name, bio, interests, kycVerified, reclaimProofs } = req.body;

        if (!name || !bio) {
            return res.status(400).json({
                success: false,
                message: 'Name and bio are required'
            });
        }

        const user = await User.create({
            name,
            bio,
            interests: interests || [],
            kycVerified: kycVerified || false,
            reclaimProofs: reclaimProofs || null
        });

        res.status(201).json({
            success: true,
            data: user,
            message: 'Profile created successfully'
        });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating profile',
            error: error.message
        });
    }
});

// Fetch match history
app.get('/api/matches/:userId', async (req, res) => {
    try {
        const matches = await Match.find({
            users: req.params.userId,
            status: 'active'
        }).populate('users', 'name interests');

        res.json({
            success: true,
            data: matches
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching matches',
            error: error.message
        });
    }
});

// Fetch chat history
app.get('/api/messages/:userId/:partnerId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.params.userId, receiverId: req.params.partnerId },
                { senderId: req.params.partnerId, receiverId: req.params.userId }
            ]
        }).sort({ timestamp: 1 });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

// Routes

// Create new user profile
app.post('/api/users', async (req, res) => {
    try {
        const { name, bio, interests, kycVerified, reclaimProofs } = req.body;

        // Validation
        if (!name || !bio) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and bio are required' 
            });
        }

        // Create new user
        const user = new User({
            name,
            bio,
            interests: interests || [],
            kycVerified: kycVerified || false,
            reclaimProofs: reclaimProofs || null
        });

        // Save to database
        await user.save();

        res.status(201).json({
            success: true,
            data: user,
            message: 'Profile created successfully'
        });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating profile',
            error: error.message
        });
    }
});

// KYC VERIFICATION

app.post('/api/users/verify-kyc', async (req, res) => {
    try {
        const { userId, reclaimProofs } = req.body;

        if (!reclaimProofs) {
            return res.status(400).json({
                success: false,
                message: 'Verification proofs are required'
            });
        }

        // Update user's KYC status
        const user = await User.findByIdAndUpdate(
            userId,
            {
                kycVerified: true,
                reclaimProofs,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user,
            message: 'KYC verification successful'
        });
    } catch (error) {
        console.error('Error verifying KYC:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying KYC',
            error: error.message
        });
    }
});


// Add an endpoint to get verified users
app.get('/api/users/verified', async (req, res) => {
    try {
        const users = await User.find({ kycVerified: true }).select('-reclaimProofs');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching verified users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching verified users',
            error: error.message
        });
    }
});


// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-__v');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, bio, interests, kycVerified } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                bio,
                interests,
                kycVerified,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// Delete user profile
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting profile',
            error: error.message
        });
    }
});


app.post('/api/users/match', async (req, res) => {
    try {
        const { userId } = req.body;

        // Get current user
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get all other users
        const allUsers = await User.find({ _id: { $ne: userId } });

        // Calculate match scores
        const matches = allUsers.map(user => {
            // Calculate common interests
            const commonInterests = user.interests.filter(interest => 
                currentUser.interests.includes(interest)
            );

            // Base score on common interests
            let score = (commonInterests.length / Math.max(currentUser.interests.length, user.interests.length)) * 70;

            // Additional scoring factors
            // Add 30% random factor to make matching more dynamic
            score += Math.random() * 30;

            return {
                userId: user._id,
                name: user.name,
                interests: user.interests,
                commonInterests,
                score
            };
        });

        // Sort by score
        const sortedMatches = matches.sort((a, b) => b.score - a.score);

        res.json({
            success: true,
            data: sortedMatches
        });
    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding matches',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});