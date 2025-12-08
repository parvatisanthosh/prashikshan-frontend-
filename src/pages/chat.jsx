import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from './socket';

export default function Chat() {
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const BACKEND_URL = 'http://localhost:8000'; // Change to your backend URL

  // Fetch chat rooms on mount
  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/chat/rooms`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch rooms');
      
      const data = await response.json();
      setRooms(data.chatRooms || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      alert('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  // Join room and fetch messages
  const joinRoom = async (roomId) => {
    if (!socket || !isConnected) {
      alert('Not connected to chat server');
      return;
    }

    // Leave previous room
    if (selectedRoom && selectedRoom !== roomId) {
      socket.emit('leave-room', selectedRoom);
    }

    setSelectedRoom(roomId);
    setMessages([]);
    
    // Fetch messages from API
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/chat/rooms/${roomId}/messages`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.messages || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      alert('Failed to load messages');
    }

    // Join socket room
    socket.emit('join-room', roomId);
  };

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    // New message received
    socket.on('new-message', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, {
        id: message.id,
        message: message.message,
        senderId: message.senderId,
        sender: { displayName: message.senderName },
        createdAt: message.timestamp
      }]);
      scrollToBottom();
    });

    // User typing indicator
    socket.on('user-typing', ({ userName, isTyping: typing }) => {
      setIsTyping(typing);
      if (typing) {
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    // User joined room
    socket.on('user-joined', ({ userName }) => {
      console.log(`${userName} joined the room`);
    });

    // User left room
    socket.on('user-left', ({ userName }) => {
      console.log(`${userName} left the room`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      alert(error.message || 'An error occurred');
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('error');
    };
  }, [socket]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !socket || !isConnected) {
      return;
    }

    socket.emit('send-message', {
      roomId: selectedRoom,
      message: newMessage.trim()
    });

    setNewMessage('');
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing-stop', selectedRoom);
  };

  const handleTyping = () => {
    if (!selectedRoom || !socket || !isConnected) return;
    
    socket.emit('typing-start', selectedRoom);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing-stop', selectedRoom);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUserId = () => {
    // You might need to adjust this based on how you store user info
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat Rooms */}
      <div className="w-80 bg-white border-r shadow-sm overflow-y-auto">
        <div className="p-4 border-b bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          <div className="flex items-center mt-2 text-sm">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chat rooms available</div>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`p-4 cursor-pointer hover:bg-blue-50 border-b transition-colors ${
                selectedRoom === room.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="font-semibold text-gray-800">{room.name}</div>
              <div className="text-sm text-gray-500 capitalize">{room.type}</div>
              {room.messages && room.messages[0] && (
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {room.messages[0].message}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800">
                {rooms.find(r => r.id === selectedRoom)?.name || 'Chat Room'}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map(msg => {
                  const isOwnMessage = msg.senderId === currentUserId;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg p-3 shadow-sm ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-800'
                        }`}>
                          {!isOwnMessage && (
                            <div className="font-semibold text-sm mb-1">
                              {msg.sender?.displayName || 'Unknown'}
                            </div>
                          )}
                          <div className="break-words">{msg.message}</div>
                          <div className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {isTyping && (
                <div className="text-sm text-gray-500 italic pl-4">
                  Someone is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4 shadow-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xl">Select a chat room to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}