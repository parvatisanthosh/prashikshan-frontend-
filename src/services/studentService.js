import api from '../config/api';

/**
 * Student Service - API methods for student dashboard
 * Backend routes: /api/student/*
 */
class StudentService {

  // ==================== DASHBOARD ====================

  /**
   * Get dashboard statistics
   * GET /student/dashboard/stats
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/student/dashboard/stats');
      return {
        cgpa: response.data.cgpa || 0,
        attendance: response.data.attendance || 0,
        assignments: response.data.assignments || 0,
        courses: response.data.courses || 0
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard stats');
    }
  }

  // ==================== PROFILE MANAGEMENT ====================

  /**
   * Get student profile
   * GET /student/profile
   */
  async getProfile() {
    try {
      const response = await api.get('/student/profile');
      return {
        success: true,
        profile: response.data.profile
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch profile');
    }
  }

  /**
   * Get avatar URL (with fallback)
   * GET /student/profile/avatar-url
   */
  async getAvatarUrl() {
    try {
      const response = await api.get('/student/profile/avatar-url');
      return {
        success: true,
        avatarURL: response.data.avatarURL,
        isFallback: response.data.isFallback
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch avatar URL');
    }
  }

  /**
   * Update student profile
   * PUT /student/profile
   */
  async updateProfile(data) {
    try {
      const response = await api.put('/student/profile', data);
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
        profile: response.data.profile
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update profile');
    }
  }

  /**
   * Upload avatar
   * POST /student/profile/avatar
   */
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/student/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data] // Prevent axios from transforming FormData
      });

      return {
        success: true,
        message: response.data.message || 'Avatar uploaded successfully',
        avatarURL: response.data.avatarURL
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to upload avatar');
    }
  }

  /**
   * Upload cover photo
   * POST /student/profile/cover
   */
  async uploadCover(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/student/profile/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data]
      });

      return {
        success: true,
        message: response.data.message || 'Cover photo uploaded successfully',
        coverURL: response.data.coverURL
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to upload cover photo');
    }
  }

  /**
   * Upload resume
   * POST /student/profile/resume
   */
  async uploadResume(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/student/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data]
      });

      return {
        success: true,
        message: response.data.message || 'Resume uploaded successfully',
        resumeURL: response.data.resumeURL
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to upload resume');
    }
  }

  // ==================== COURSES ====================

  /**
   * Get enrolled courses
   * GET /student/courses
   */
  async getCourses() {
    try {
      const response = await api.get('/student/courses');
      return {
        success: true,
        courses: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch courses');
    }
  }

  // ==================== ASSIGNMENTS ====================

  /**
   * Get all assignments
   * GET /student/assignments
   */
  async getAssignments() {
    try {
      const response = await api.get('/student/assignments');
      return {
        success: true,
        assignments: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch assignments');
    }
  }

  /**
   * Upload assignment submission
   * POST /student/assignments/:assignmentId/upload
   */
  async uploadAssignment(assignmentId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/student/assignments/${assignmentId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return {
        success: true,
        message: response.data.message || 'Assignment uploaded successfully',
        uploadedFile: response.data.uploadedFile
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to upload assignment');
    }
  }

  // ==================== INTERNSHIPS ====================

  /**
   * Get available internships
   * GET /student/internships
   */
  async getInternships(params = {}) {
    try {
      const { search, type, location } = params;
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (type) queryParams.append('type', type);
      if (location) queryParams.append('location', location);

      const response = await api.get(`/student/internships?${queryParams.toString()}`);
      return {
        success: true,
        internships: response.data.internships || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch internships');
    }
  }

  /**
   * Apply to internship
   * POST /student/internships/:id/apply
   */
  async applyToInternship(internshipId, data = {}) {
    try {
      const response = await api.post(`/student/internships/${internshipId}/apply`, data);
      return {
        success: true,
        message: response.data.message || 'Application submitted successfully',
        application: response.data.application
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to apply to internship');
    }
  }

  /**
   * Get my internship applications
   * GET /student/internships/applications
   */
  async getMyApplications() {
    try {
      const response = await api.get('/student/internships/applications');
      return {
        success: true,
        applications: response.data.applications || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch applications');
    }
  }

  // ==================== SCHEDULE ====================

  /**
   * Get student schedule
   * GET /student/schedule
   */
  async getSchedule() {
    try {
      const response = await api.get('/student/schedule');
      return {
        success: true,
        schedule: response.data.schedule || { assignments: [], sessions: [] }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch schedule');
    }
  }

  // ==================== CERTIFICATES ====================

  /**
   * Get all certificates
   * GET /student/certificates
   */
  async getCertificates() {
    try {
      const response = await api.get('/student/certificates');
      return {
        success: true,
        certificates: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch certificates');
    }
  }

  /**
   * Upload certificate
   * POST /student/certificates
   */
  async uploadCertificate(file, data) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', data.name);
      formData.append('issuer', data.issuer);
      formData.append('issueDate', data.issueDate);
      if (data.category) formData.append('category', data.category);

      const response = await api.post('/student/certificates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return {
        success: true,
        message: 'Certificate uploaded successfully',
        certificate: response.data.certificate
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to upload certificate');
    }
  }

  /**
   * Delete certificate
   * DELETE /student/certificates/:id
   */
  async deleteCertificate(certificateId) {
    try {
      const response = await api.delete(`/student/certificates/${certificateId}`);
      return {
        success: true,
        message: response.data.message || 'Certificate deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete certificate');
    }
  }

  // ==================== LOGBOOK ENTRIES ====================

  /**
   * Get logbook entries
   * GET /student/logbook/entries
   */
  async getLogbookEntries() {
    try {
      const response = await api.get('/student/logbook/entries');
      return {
        success: true,
        entries: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch logbook entries');
    }
  }

  /**
   * Create logbook entry
   * POST /student/logbook/entries
   */
  async createLogbookEntry(data) {
    try {
      const response = await api.post('/student/logbook/entries', data);
      return {
        success: true,
        message: 'Logbook entry created successfully',
        entry: response.data.entry
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create logbook entry');
    }
  }

  /**
   * Update logbook entry
   * PUT /student/logbook/entries/:id
   */
  async updateLogbookEntry(entryId, data) {
    try {
      const response = await api.put(`/student/logbook/entries/${entryId}`, data);
      return {
        success: true,
        message: response.data.message || 'Logbook entry updated successfully',
        entry: response.data.entry
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update logbook entry');
    }
  }

  /**
   * Delete logbook entry
   * DELETE /student/logbook/entries/:id
   */
  async deleteLogbookEntry(entryId) {
    try {
      const response = await api.delete(`/student/logbook/entries/${entryId}`);
      return {
        success: true,
        message: response.data.message || 'Logbook entry deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete logbook entry');
    }
  }

  // ==================== LOGBOOK GOALS ====================

  /**
   * Get logbook goals
   * GET /student/logbook/goals
   */
  async getLogbookGoals() {
    try {
      const response = await api.get('/student/logbook/goals');
      return {
        success: true,
        goals: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch logbook goals');
    }
  }

  /**
   * Create logbook goal
   * POST /student/logbook/goals
   */
  async createLogbookGoal(data) {
    try {
      const response = await api.post('/student/logbook/goals', data);
      return {
        success: true,
        message: 'Logbook goal created successfully',
        goal: response.data.goal
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create logbook goal');
    }
  }

  /**
   * Update logbook goal
   * PUT /student/logbook/goals/:id
   */
  async updateLogbookGoal(goalId, data) {
    try {
      const response = await api.put(`/student/logbook/goals/${goalId}`, data);
      return {
        success: true,
        message: response.data.message || 'Logbook goal updated successfully',
        goal: response.data.goal
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update logbook goal');
    }
  }

  /**
   * Delete logbook goal
   * DELETE /student/logbook/goals/:id
   */
  async deleteLogbookGoal(goalId) {
    try {
      const response = await api.delete(`/student/logbook/goals/${goalId}`);
      return {
        success: true,
        message: response.data.message || 'Logbook goal deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete logbook goal');
    }
  }

  // ==================== ACTIVITY LOGS ====================

  /**
   * Get activity logs
   * GET /student/activity/logs
   */
  async getActivityLogs() {
    try {
      const response = await api.get('/student/activity/logs');
      return {
        success: true,
        logs: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch activity logs');
    }
  }

  /**
   * Create activity log
   * POST /student/activity/logs
   */
  async createActivityLog(data) {
    try {
      const response = await api.post('/student/activity/logs', data);
      return {
        success: true,
        message: 'Activity log created successfully',
        log: response.data.log
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create activity log');
    }
  }

  /**
   * Update activity log
   * PUT /student/activity/logs/:id
   */
  async updateActivityLog(logId, data) {
    try {
      const response = await api.put(`/student/activity/logs/${logId}`, data);
      return {
        success: true,
        message: response.data.message || 'Activity log updated successfully',
        log: response.data.log
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update activity log');
    }
  }

  /**
   * Delete activity log
   * DELETE /student/activity/logs/:id
   */
  async deleteActivityLog(logId) {
    try {
      const response = await api.delete(`/student/activity/logs/${logId}`);
      return {
        success: true,
        message: response.data.message || 'Activity log deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete activity log');
    }
  }

  // ==================== ACTIVITY GOALS ====================

  /**
   * Get activity goals
   * GET /student/activity/goals
   */
  async getActivityGoals() {
    try {
      const response = await api.get('/student/activity/goals');
      return {
        success: true,
        goals: response.data || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch activity goals');
    }
  }

  /**
   * Create activity goal
   * POST /student/activity/goals
   */
  async createActivityGoal(data) {
    try {
      const response = await api.post('/student/activity/goals', data);
      return {
        success: true,
        message: 'Activity goal created successfully',
        goal: response.data.goal
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create activity goal');
    }
  }

  /**
   * Update activity goal
   * PUT /student/activity/goals/:id
   */
  async updateActivityGoal(goalId, data) {
    try {
      const response = await api.put(`/student/activity/goals/${goalId}`, data);
      return {
        success: true,
        message: response.data.message || 'Activity goal updated successfully',
        goal: response.data.goal
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update activity goal');
    }
  }

  /**
   * Delete activity goal
   * DELETE /student/activity/goals/:id
   */
  async deleteActivityGoal(goalId) {
    try {
      const response = await api.delete(`/student/activity/goals/${goalId}`);
      return {
        success: true,
        message: response.data.message || 'Activity goal deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete activity goal');
    }
  }

  // ==================== INTERNSHIP REPORT ====================

  /**
   * Get internship report data
   * GET /student/internship-report
   */
  async getInternshipReport() {
    try {
      const response = await api.get('/student/internship-report');
      return {
        success: true,
        student: response.data.student || {},
        company: response.data.company || {},
        college: response.data.college || {},
        logs: response.data.logs || [],
        projects: response.data.projects || [],
        report: response.data.report || {}
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch internship report');
    }
  }

  /**
   * Get internship report as HTML
   * GET /student/internship-report/html
   */
  async getInternshipReportHtml() {
    try {
      const response = await api.get('/student/internship-report/html');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to generate HTML report');
    }
  }

  /**
   * Get internship report as PDF
   * GET /student/internship-report/pdf
   */
  async getInternshipReportPdf() {
    try {
      const response = await api.get('/student/internship-report/pdf', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to generate PDF report');
    }
  }

  // ==================== ERROR HANDLING ====================

  handleError(error, defaultMessage) {
    if (error.response) {
      const message = error.response.data?.error || 
                      error.response.data?.message || 
                      defaultMessage;
      const customError = new Error(message);
      customError.status = error.response.status;
      customError.data = error.response.data;
      return customError;
    } else if (error.request) {
      const customError = new Error('Network error - please check your connection');
      customError.status = 0;
      return customError;
    } else {
      return new Error(defaultMessage);
    }
  }
}

// Export singleton instance
const studentService = new StudentService();
export default studentService;

// Also export individual functions for convenience
export const {
  // Dashboard
  getDashboardStats,
  // Profile
  getProfile,
  getAvatarUrl,
  updateProfile,
  uploadAvatar,
  uploadCover,
  uploadResume,
  // Courses
  getCourses,
  // Assignments
  getAssignments,
  uploadAssignment,
  // Internships
  getInternships,
  applyToInternship,
  getMyApplications,
  // Schedule
  getSchedule,
  // Certificates
  getCertificates,
  uploadCertificate,
  deleteCertificate,
  // Logbook Entries
  getLogbookEntries,
  createLogbookEntry,
  updateLogbookEntry,
  deleteLogbookEntry,
  // Logbook Goals
  getLogbookGoals,
  createLogbookGoal,
  updateLogbookGoal,
  deleteLogbookGoal,
  // Activity Logs
  getActivityLogs,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
  // Activity Goals
  getActivityGoals,
  createActivityGoal,
  updateActivityGoal,
  deleteActivityGoal,
  // Internship Report
  getInternshipReport,
  getInternshipReportHtml,
  getInternshipReportPdf
} = studentService;
