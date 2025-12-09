import api from '../config/api';

/**
 * Mentor Service - API methods for mentor dashboard
 * Backend routes: /api/mentor/*
 */
class MentorService {
  
  // ==================== DASHBOARD STATS ====================
  
  /**
   * Get dashboard statistics for the mentor
   * GET /mentor/stats
   * @returns {Promise<{totalStudents, upcomingSessions, completedSessions, pendingRequests}>}
   */
  async getallMentors(){
    try{
      const response=await api.get('/mentor/all');
      return response.data;
    }catch(error){
      throw error;
      
    }
  }

  async getDashboardStats() {
    try {
      const response = await api.get('/mentor/stats');
      return this.normalizeStatsResponse(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw this.handleError(error, 'Failed to fetch dashboard stats');
    }
  }

  normalizeStatsResponse(data) {
    return {
      totalStudents: data.totalStudents || 0,
      upcomingSessions: data.upcomingSessions || 0,
      completedSessions: data.completedSessions || 0,
      pendingRequests: data.pendingRequests || 0,
      monthlyHours: data.monthlyHours || 0
    };
  }

  // ==================== SESSIONS ====================
  
  /**
   * Get upcoming sessions for the mentor
   * GET /mentor/sessions/upcoming
   * @returns {Promise<Array>} List of upcoming sessions
   */
  async getUpcomingSessions() {
    try {
      const response = await api.get('/mentor/sessions/upcoming');
      const sessions = Array.isArray(response.data) ? response.data : [];
      return sessions.map(session => this.normalizeSession(session));
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw this.handleError(error, 'Failed to fetch upcoming sessions');
    }
  }

  normalizeSession(session) {
    return {
      id: session.id,
      student: session.studentName || session.student || 'Unknown Student',
      studentName: session.studentName || session.student || 'Unknown Student',
      topic: session.topic || 'General Discussion',
      date: session.date || '',
      time: session.time || '',
      duration: session.duration || '30 minutes',
      status: session.status || 'scheduled'
    };
  }

  // ==================== STUDENTS ====================
  
  /**
   * Get all students assigned to the mentor
   * GET /mentor/students
   * @returns {Promise<Array>} List of assigned students
   */
  async getAssignedStudents() {
    try {
      const response = await api.get('/mentor/students');
      const students = Array.isArray(response.data) ? response.data : [];
      return students.map(student => this.normalizeStudent(student));
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      throw this.handleError(error, 'Failed to fetch assigned students');
    }
  }

  normalizeStudent(student) {
    return {
      id: student.id,
      name: student.name || 'Unknown',
      email: student.email || '',
      course: student.course || 'N/A',
      year: student.year || 'N/A',
      progress: student.progress || 0,
      lastContact: student.lastContact || 'Never',
      sessionsCompleted: student.sessionsCompleted || 0,
      upcomingSessions: student.upcomingSessions || 0,
      status: student.status || 'Active',
      interests: student.interests || []
    };
  }

  // ==================== BOOKINGS ====================
  
  /**
   * Get all bookings for the mentor
   * GET /mentor/bookings
   * @returns {Promise<Array>} List of bookings
   */
  async getBookings() {
    try {
      const response = await api.get('/mentor/bookings');
      const bookings = Array.isArray(response.data) ? response.data : [];
      return bookings.map(booking => this.normalizeBooking(booking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw this.handleError(error, 'Failed to fetch bookings');
    }
  }

  normalizeBooking(booking) {
    return {
      id: booking.id,
      date: booking.date || '',
      time: booking.time || '',
      student: booking.student || 'Unknown Student',
      topic: booking.topic || 'General Discussion',
      status: booking.status || 'Pending',
      notes: booking.notes || ''
    };
  }

  /**
   * Confirm a booking
   * PUT /mentor/bookings/:bookingId/confirm
   * @param {string} bookingId - The booking ID to confirm
   * @returns {Promise<{success, bookingId, message}>}
   */
  async confirmBooking(bookingId) {
    try {
      const response = await api.put(`/mentor/bookings/${bookingId}/confirm`);
      return {
        success: true,
        bookingId,
        message: response.data?.message || 'Booking confirmed successfully'
      };
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw this.handleError(error, 'Failed to confirm booking');
    }
  }

  /**
   * Cancel a booking
   * DELETE /mentor/bookings/:bookingId/cancel
   * @param {string} bookingId - The booking ID to cancel
   * @returns {Promise<{success, bookingId, message}>}
   */
  async cancelBooking(bookingId) {
    try {
      const response = await api.delete(`/mentor/bookings/${bookingId}/cancel`);
      return {
        success: true,
        bookingId,
        message: response.data?.message || 'Booking cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw this.handleError(error, 'Failed to cancel booking');
    }
  }

  // ==================== NOTIFICATIONS ====================
  
  /**
   * Get all notifications for the mentor
   * GET /mentor/notifications
   * @returns {Promise<Array>} List of notifications
   */
  async getNotifications() {
    try {
      const response = await api.get('/mentor/notifications');
      const notifications = Array.isArray(response.data) ? response.data : [];
      return notifications.map(notification => this.normalizeNotification(notification));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw this.handleError(error, 'Failed to fetch notifications');
    }
  }

  normalizeNotification(notification) {
    return {
      id: notification.id,
      type: notification.type || 'general',
      title: notification.title || '',
      message: notification.message || '',
      timestamp: notification.timestamp || new Date().toISOString(),
      read: notification.read || false,
      priority: notification.priority || 'medium',
      actionRequired: notification.actionRequired || false,
      relatedContext: notification.relatedContext || {}
    };
  }

  /**
   * Mark a notification as read
   * PUT /mentor/notifications/:notificationId/read
   * @param {string} notificationId - The notification ID to mark as read
   * @returns {Promise<{success, notificationId}>}
   */
  async markNotificationAsRead(notificationId) {
    try {
      await api.put(`/mentor/notifications/${notificationId}/read`);
      return { success: true, notificationId };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw this.handleError(error, 'Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   * PUT /mentor/notifications/read-all
   * @returns {Promise<{success, message}>}
   */
  async markAllNotificationsAsRead() {
    try {
      await api.put('/mentor/notifications/read-all');
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw this.handleError(error, 'Failed to mark all notifications as read');
    }
  }

  // ==================== CHAT ====================
  
  /**
   * Get chat contacts for the mentor
   * GET /mentor/chat/contacts
   * @returns {Promise<Array>} List of chat contacts
   */
  async getChatContacts() {
    try {
      const response = await api.get('/mentor/chat/contacts');
      const contacts = Array.isArray(response.data) ? response.data : [];
      return contacts.map(contact => this.normalizeChatContact(contact));
    } catch (error) {
      console.error('Error fetching chat contacts:', error);
      throw this.handleError(error, 'Failed to fetch chat contacts');
    }
  }

  normalizeChatContact(contact) {
    return {
      id: contact.id,
      name: contact.name || 'Unknown',
      avatar: contact.avatar || contact.name?.split(' ').map(n => n[0]).join('') || '??',
      lastMessage: contact.lastMessage || '',
      timestamp: contact.timestamp || '',
      unread: contact.unread || 0,
      online: contact.online || false
    };
  }

  /**
   * Get chat messages with a specific contact
   * GET /mentor/chat/messages/:contactId
   * @param {string} contactId - The contact ID to get messages for
   * @returns {Promise<Array>} List of messages
   */
  async getChatMessages(contactId) {
    try {
      const response = await api.get(`/mentor/chat/messages/${contactId}`);
      const messages = Array.isArray(response.data) ? response.data : [];
      return messages.map(message => this.normalizeChatMessage(message));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw this.handleError(error, 'Failed to fetch chat messages');
    }
  }

  normalizeChatMessage(message) {
    return {
      id: message.id,
      sender: message.sender || 'unknown',
      text: message.text || message.message || '',
      timestamp: message.timestamp || new Date().toISOString()
    };
  }

  /**
   * Send a chat message
   * POST /mentor/chat/send
   * @param {string} contactId - The contact ID to send message to
   * @param {string} message - The message text
   * @returns {Promise<{success, message}>}
   */
  async sendChatMessage(contactId, message) {
    try {
      const response = await api.post('/mentor/chat/send', { contactId, message });
      return {
        success: true,
        message: response.data?.message || {
          id: Date.now(),
          sender: 'mentor',
          text: message,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.handleError(error, 'Failed to send chat message');
    }
  }

  // ==================== AVAILABILITY ====================
  
  /**
   * Get mentor's availability schedule
   * GET /mentor/availability
   * @returns {Promise<Object>} Availability by day of week
   */
  async getAvailability() {
    try {
      const response = await api.get('/mentor/availability');
      return this.normalizeAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw this.handleError(error, 'Failed to fetch availability');
    }
  }

  normalizeAvailability(data) {
    const defaultAvailability = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    if (!data || typeof data !== 'object') {
      return defaultAvailability;
    }

    return {
      Monday: data.Monday || [],
      Tuesday: data.Tuesday || [],
      Wednesday: data.Wednesday || [],
      Thursday: data.Thursday || [],
      Friday: data.Friday || [],
      Saturday: data.Saturday || [],
      Sunday: data.Sunday || []
    };
  }

  /**
   * Update mentor's availability schedule
   * PUT /mentor/availability
   * @param {Object} availabilityData - Availability by day of week
   * @returns {Promise<{success, data}>}
   */
  async saveAvailability(availabilityData) {
    try {
      const response = await api.put('/mentor/availability', availabilityData);
      return {
        success: true,
        data: response.data?.data || availabilityData
      };
    } catch (error) {
      console.error('Error saving availability:', error);
      throw this.handleError(error, 'Failed to save availability');
    }
  }

  // ==================== ERROR HANDLING ====================
  
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || 
                      error.response.data?.message || 
                      defaultMessage;
      const customError = new Error(message);
      customError.status = error.response.status;
      customError.data = error.response.data;
      return customError;
    } else if (error.request) {
      // Request made but no response
      const customError = new Error('Network error - please check your connection');
      customError.status = 0;
      return customError;
    } else {
      // Error in request setup
      return new Error(defaultMessage);
    }
  }
}

// Export singleton instance
const mentorService = new MentorService();
export default mentorService;

// Also export individual functions for convenience
export const {
  getDashboardStats,
  getUpcomingSessions,
  getAssignedStudents,
  getBookings,
  confirmBooking,
  cancelBooking,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getChatContacts,
  getChatMessages,
  sendChatMessage,
  getAvailability,
  saveAvailability
} = mentorService;
