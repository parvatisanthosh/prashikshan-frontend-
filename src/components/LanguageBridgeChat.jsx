// FILE: frontend/src/components/LanguageBridgeChat.jsx
// Real-time chat with instant translation

import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socketService';

const LANGUAGES = {
  'en': { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  'hi': { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  'ka': { name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  'ta': { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  'te': { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  'ml': { name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  'bn': { name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
  'gu': { name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  'mr': { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  'pa': { name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  'ur': { name: 'Urdu', flag: '🇮🇳', nativeName: 'اردو' },
  'ks': { name: 'Kashmiri', flag: '🇮🇳', nativeName: 'कॉशुर' }
};

export default function LanguageBridgeChat({ roomId, currentUser, recipientName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connect to socket on mount
  useEffect(() => {
    const connect = () => {
      socketService.connect();
      
      // Get saved language preference
      const savedLang = localStorage.getItem('preferredLanguage') || 'en';
      setCurrentLanguage(savedLang);
      socketService.setLanguage(savedLang);

      setIsConnected(socketService.isConnected());
    };

    connect();

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    return () => {
      clearInterval(checkConnection);
    };
  }, []);

  // Join room and setup listeners
  useEffect(() => {
    if (!roomId || !isConnected) return;

    // Join room
    socketService.joinChatRoom(roomId);

    // Listen for messages
    const handleMessage = (message) => {
      console.log('📨 Received message:', message);
      setMessages((prev) => [...prev, message]);
    };

    // Listen for typing indicators
    const handleTyping = ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return [...prev.filter(u => u.userId !== userId), { userId, userName }];
        } else {
          return prev.filter(u => u.userId !== userId);
        }
      });
    };

    socketService.onMessageReceived(handleMessage);
    socketService.onTyping(handleTyping);

    // Cleanup
    return () => {
      socketService.leaveChatRoom(roomId);
      socketService.off('chat:message', handleMessage);
      socketService.off('chat:typing', handleTyping);
    };
  }, [roomId, isConnected]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    socketService.setLanguage(langCode);
    setShowLanguageSelector(false);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTypingIndicator(roomId, true, currentUser.name);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTypingIndicator(roomId, false, currentUser.name);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() && isConnected) {
      socketService.sendMessage(roomId, inputMessage, currentUser.id, currentUser.name);
      setInputMessage('');
      
      // Clear typing indicator
      setIsTyping(false);
      socketService.sendTypingIndicator(roomId, false, currentUser.name);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🌍 Language Bridge Chat
            {!isConnected && (
              <span className="text-xs bg-red-500 px-2 py-1 rounded">Connecting...</span>
            )}
          </h3>
          <p className="text-sm text-blue-100">
            Chatting with: {recipientName || 'Room'}
          </p>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <span className="text-2xl">{LANGUAGES[currentLanguage].flag}</span>
            <span className="text-sm font-medium">{LANGUAGES[currentLanguage].nativeName}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Language Dropdown */}
          {showLanguageSelector && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 font-semibold px-3 py-2">SELECT YOUR LANGUAGE</p>
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition ${
                      currentLanguage === code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{lang.name}</p>
                      <p className="text-xs text-gray-500">{lang.nativeName}</p>
                    </div>
                    {currentLanguage === code && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Messages will be automatically translated to {LANGUAGES[currentLanguage].name}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg shadow-sm ${
                  msg.senderId === currentUser.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {/* Sender name for received messages */}
                {msg.senderId !== currentUser.id && (
                  <div className="px-4 pt-3 pb-1 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      {msg.senderName}
                      <span className="text-xl">{LANGUAGES[msg.senderLanguage]?.flag}</span>
                    </p>
                  </div>
                )}

                {/* Message content */}
                <div className="px-4 py-3">
                  <p className="text-sm">{msg.message}</p>
                  
                  {/* Translation indicator */}
                  {msg.isTranslated && (
                    <div className={`mt-2 pt-2 border-t ${
                      msg.senderId === currentUser.id ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <p className="text-xs opacity-75 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        Translated from {LANGUAGES[msg.senderLanguage]?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="px-4 pb-2">
                  <p className={`text-xs opacity-70 ${
                    msg.senderId === currentUser.id ? 'text-right' : 'text-left'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600 italic border-t border-gray-200">
          <span className="inline-flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </span>
            {typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder={`Type in ${LANGUAGES[currentLanguage].nativeName}...`}
            disabled={!isConnected}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          🌍 Auto-translates to recipient's language • Supports 12 languages
        </p>
      </form>
    </div>
  );
}