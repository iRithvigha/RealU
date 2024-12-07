import React, { useState, useEffect, useRef } from 'react';
import { Video, Send, Smile, MoreVertical, Image as ImageIcon, Gamepad2 } from 'lucide-react';

const dummyMessages = [
  { text: "Hey! I saw you're also interested in NFTs!", sent: false, timestamp: '10:30 AM' },
  { text: "Yes! I'm really into generative art collections. What about you?", sent: true, timestamp: '10:31 AM' },
  { text: "That's awesome! I'm a big fan of Art Blocks. Have you seen their latest drops?", sent: false, timestamp: '10:32 AM' },
  { text: "I've been following them closely! The algorithms they use are incredible.", sent: true, timestamp: '10:33 AM' },
];

const suggestions = [
  "What's your favorite NFT collection?",
  "How long have you been in Web3?",
  "What blockchain projects interest you?",
  "Thoughts on DeFi?",
  "Which wallet do you prefer?",
  "Favorite crypto artist?",
  "Been to any Web3 events?",
  "Your thoughts on DAOs?",
];

export function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sent: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
    
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more.",
        "I completely agree with you!",
        "I've had similar experiences in the Web3 space.",
        "What made you interested in that?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sent: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 2000);
  };

  const gameonclick = () => {
    window.location.href = '/sas';
  }
  return (
    <div className="h-screen flex flex-col bg-red-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h3 className="font-semibold">Anonymous#1234</h3>
            <p className="text-sm text-gray-500">
              {isTyping ? (
                <span className="text-red-600">typing...</span>
              ) : (
                'Online'
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full hover:from-red-600 hover:to-rose-600 transition-all duration-300 flex items-center space-x-1"
            onClick={gameonclick}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Split & Steal</span>
          </button>
          <button className="p-2 text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full hover:from-red-600 hover:to-rose-600 transition-all duration-300">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[70%] space-y-1">
              <div
                className={`rounded-2xl px-4 py-2 ${
                  msg.sent
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                    : 'bg-white border shadow-sm text-gray-800'
                }`}
              >
                {msg.text}
              </div>
              <div
                className={`text-xs ${
                  msg.sent ? 'text-right text-gray-500' : 'text-gray-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="bg-white border-t p-2 flex gap-2 overflow-x-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setMessage(suggestion)}
            className="flex-shrink-0 px-3 py-1 bg-red-50 rounded-full text-sm text-red-600 hover:bg-red-100 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
            <Smile className="w-6 h-6" />
          </button>
          <button className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button 
            onClick={sendMessage} 
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-300 ${
              message.trim() 
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}