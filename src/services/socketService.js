// FILE: frontend/src/services/socketService.js
// Socket.IO client with translation support

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.currentLanguage = 'en'; // Default language
  }

  // Connect to Socket.IO server
  connect() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No token found. Cannot connect to socket.');
      return;
    }

    if (this.socket?.connected) {
      console.log('✅ Already connected to socket');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
      
      // Set user's preferred language
      const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
      this.setLanguage(savedLanguage);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    return this.socket;
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  // ==================== LANGUAGE METHODS ====================

  setLanguage(language) {
    if (this.socket) {
      this.currentLanguage = language;
      localStorage.setItem('preferredLanguage', language);
      this.socket.emit('language:set', { language });
      console.log(`🌍 Language set to: ${language}`);
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages(callback) {
    if (this.socket) {
      this.socket.emit('language:getSupportedLanguages');
      this.socket.once('language:supportedLanguages', callback);
    }
  }

  onLanguageUpdated(callback) {
    if (this.socket) {
      this.socket.on('language:updated', callback);
    }
  }

  // ==================== CHAT METHODS WITH TRANSLATION ====================

  joinChatRoom(roomId) {
    if (this.socket) {
      this.socket.emit('chat:join', roomId);
      console.log(`📨 Joined chat room: ${roomId}`);
    }
  }

  leaveChatRoom(roomId) {
    if (this.socket) {
      this.socket.emit('chat:leave', roomId);
      console.log(`📭 Left chat room: ${roomId}`);
    }
  }

  sendMessage(roomId, message, senderId, senderName) {
    if (this.socket) {
      this.socket.emit('chat:message', {
        roomId,
        message,
        senderId,
        senderName,
        senderLanguage: this.currentLanguage
      });
    }
  }

  sendTypingIndicator(roomId, isTyping, userName) {
    if (this.socket) {
      this.socket.emit('chat:typing', {
        roomId,
        isTyping,
        userName
      });
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('chat:message', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('chat:typing', callback);
    }
  }

  // ==================== VOICE TRANSLATION ====================

  translateVoice(text, targetLanguage, sourceLanguage, callback) {
    if (this.socket) {
      this.socket.emit('voice:translate', {
        text,
        targetLanguage,
        sourceLanguage
      });
      this.socket.once('voice:translated', callback);
    }
  }

  // ==================== NOTIFICATION METHODS ====================

  sendNotification(targetUserId, notification) {
    if (this.socket) {
      this.socket.emit('notification:send', {
        targetUserId,
        notification
      });
    }
  }

  onNotificationReceived(callback) {
    if (this.socket) {
      this.socket.on('notification:received', callback);
    }
  }

  // ==================== PRESENCE METHODS ====================

  getOnlineUsers() {
    if (this.socket) {
      this.socket.emit('presence:getOnline');
    }
  }

  checkUserOnline(userId) {
    if (this.socket) {
      this.socket.emit('presence:check', userId);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user:online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user:offline', callback);
    }
  }

  onPresenceStatus(callback) {
    if (this.socket) {
      this.socket.on('presence:status', callback);
    }
  }

  // ==================== INTERNSHIP METHODS ====================

  notifyNewInternship(internship) {
    if (this.socket) {
      this.socket.emit('internship:new', internship);
    }
  }

  onNewInternship(callback) {
    if (this.socket) {
      this.socket.on('internship:new', callback);
    }
  }

  updateApplicationStatus(studentId, applicationId, status) {
    if (this.socket) {
      this.socket.emit('application:status', {
        studentId,
        applicationId,
        status
      });
    }
  }

  onApplicationStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('application:status', callback);
    }
  }

  // ==================== GENERIC EVENT METHODS ====================

  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }

  removeAllListeners(eventName) {
    if (this.socket) {
      this.socket.removeAllListeners(eventName);
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;