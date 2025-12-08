// FILE: src/services/facultyService.js
import api from '../config/api';

class FacultyService {
  // ==================== DASHBOARD ====================
  
  async getDashboardStats() {
    try {
      const response = await api.get('/faculty/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== CLASSES ====================
  
  async getClasses() {
    try {
      const response = await api.get('/faculty/classes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getClassById(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createClass(classData) {
    try {
      const response = await api.post('/faculty/classes', classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateClass(classId, classData) {
    try {
      const response = await api.put(`/faculty/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteClass(classId) {
    try {
      const response = await api.delete(`/faculty/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== STUDENTS ====================
  
  async getStudentsInClass(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async addStudentToClass(classId, studentData) {
    try {
      const response = await api.post(`/faculty/classes/${classId}/students`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async removeStudentFromClass(classId, studentId) {
    try {
      const response = await api.delete(`/faculty/classes/${classId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== ASSIGNMENTS ====================
  
  async getAssignments(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/assignments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createAssignment(classId, assignmentData) {
    try {
      const response = await api.post(`/faculty/classes/${classId}/assignments`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateAssignment(assignmentId, assignmentData) {
    try {
      const response = await api.put(`/faculty/assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteAssignment(assignmentId) {
    try {
      const response = await api.delete(`/faculty/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async gradeAssignment(submissionId, gradeData) {
    try {
      const response = await api.post(`/faculty/assignments/submissions/${submissionId}/grade`, gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== ATTENDANCE ====================
  
  async markAttendance(classId, attendanceData) {
    try {
      const response = await api.post(`/faculty/classes/${classId}/attendance`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getAttendanceRecords(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/attendance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateAttendance(attendanceId, attendanceData) {
    try {
      const response = await api.put(`/faculty/attendance/${attendanceId}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== PROFILE ====================
  
  async getProfile() {
    try {
      const response = await api.get('/faculty/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/faculty/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== ANALYTICS ====================
  
  async getClassAnalytics(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getStudentPerformance(classId, studentId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/students/${studentId}/performance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new FacultyService();