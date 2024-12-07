import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  interests: string[];
  score?: number;
}

export function MatchingPage() {
  const navigate = useNavigate();
  const [matchingStep, setMatchingStep] = useState(1);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  useEffect(() => {
    findMatch();
  }, []);

  const findMatch = async () => {
    try {
      // Get current user's interests from localStorage or context
      const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Fetch all users
      const response = await fetch('http://localhost:5001/api/users');
      const { data: users } = await response.json();

      // Filter out current user and calculate scores
      const otherUsers = users.filter((user: User) => user._id !== currentUserData._id);
      const scoredUsers = calculateMatchScores(currentUserData, otherUsers);
      
      // Get best match
      const bestMatch = scoredUsers[0];

      // Simulate matching steps
      setTimeout(() => setMatchingStep(2), 3000);
      setTimeout(() => {
        setMatchingStep(3);
        setMatchedUser(bestMatch);
      }, 6000);
      
      // Store matched user ID and navigate
      setTimeout(() => {
        if (bestMatch) {
          localStorage.setItem('matchedUserId', bestMatch._id);
          navigate('/chat');
        }
      }, 9000);
    } catch (error) {
      console.error('Error finding match:', error);
    }
  };

  const calculateMatchScores = (currentUser: User, otherUsers: User[]) => {
    return otherUsers
      .map(user => {
        const commonInterests = user.interests.filter(interest => 
          currentUser.interests.includes(interest)
        );
        
        // Calculate score based on common interests and other factors
        const score = (commonInterests.length / Math.max(currentUser.interests.length, user.interests.length)) * 100;
        
        return { ...user, score };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {matchingStep === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-500 to-rose-500 text-transparent bg-clip-text">
                Finding Your Perfect Match
              </h2>
              <div className="relative h-2 bg-gray-100 rounded-full mb-6">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 mb-6">Analyzing interests and preferences...</p>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-100 border-t-red-500 mx-auto"></div>
            </>
          )}

          {matchingStep === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-500 to-rose-500 text-transparent bg-clip-text">
                Found Some Potential Matches!
              </h2>
              <div className="relative h-2 bg-gray-100 rounded-full mb-6">
                <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 mb-6">Calculating compatibility scores...</p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </>
          )}

          {matchingStep === 3 && matchedUser && (
            <>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-500 to-rose-500 text-transparent bg-clip-text">
                Perfect Match Found!
              </h2>
              <div className="relative h-2 bg-gray-100 rounded-full mb-6">
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {matchedUser.name[0]}
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">Match Score: {matchedUser.score?.toFixed(0)}%</p>
              <p className="text-gray-600">Common interests: {matchedUser.interests.join(', ')}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}