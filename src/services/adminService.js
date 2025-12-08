import api from '../config/api';

/**
 * Admin Service - API methods for admin dashboard
 * Backend routes: /api/admin/*
 */
class AdminService {

  // ==================== AUTHENTICATION ====================
  
  /**
   * Register a new admin
   * POST /admin/register
   */
  async register(data) {
    try {
      const response = await api.post('/admin/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    }
  }

  /**
   * Admin login
   * POST /admin/login
   */
  async login(email, password) {
    try {
      const response = await api.post('/admin/login', { email, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  // ==================== DASHBOARD STATS ====================
  
  /**
   * Get dashboard statistics
   * GET /admin/dashboard/stats
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return this.normalizeStatsResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch dashboard stats');
    }
  }

  normalizeStatsResponse(data) {
    return {
      totalUsers: data.totalUsers || 0,
      students: data.students || 0,
      faculty: data.faculty || 0,
      mentors: data.mentors || 0,
      companies: data.companies || 0,
      internships: data.internships || 0,
      courses: data.courses || 0,
      activeInternships: data.activeInternships || 0,
      totalApplications: data.totalApplications || 0
    };
  }

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Get all users with pagination and filters
   * GET /admin/users
   */
  async getUsers(params = {}) {
    try {
      const { role, page = 1, limit = 10, search } = params;
      const queryParams = new URLSearchParams();
      if (role) queryParams.append('role', role);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/admin/users?${queryParams.toString()}`);
      return {
        users: (response.data.users || []).map(user => this.normalizeUser(user)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch users');
    }
  }

  /**
   * Get user details by ID
   * GET /admin/users/:userId
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.user ? this.normalizeUser(response.data.user) : null;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user details');
    }
  }

  /**
   * Update user
   * PUT /admin/users/:userId
   */
  async updateUser(userId, data) {
    try {
      const response = await api.put(`/admin/users/${userId}`, data);
      return {
        success: true,
        message: response.data.message || 'User updated successfully',
        user: response.data.user
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update user');
    }
  }

  /**
   * Delete user
   * DELETE /admin/users/:userId
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return {
        success: true,
        message: response.data.message || 'User deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete user');
    }
  }

  /**
   * Change user role
   * PUT /admin/users/:userId/role
   */
  async changeUserRole(userId, role) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return {
        success: true,
        message: response.data.message || 'User role updated successfully',
        userId,
        newRole: role
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to change user role');
    }
  }

  normalizeUser(user) {
    return {
      id: user.id,
      displayName: user.displayName || user.name || 'Unknown',
      name: user.displayName || user.name || 'Unknown',
      email: user.email || '',
      role: user.role || 'STUDENT',
      phone: user.phone || '',
      createdAt: user.createdAt || new Date().toISOString(),
      profile: user.profile || null,
      facultyProfile: user.facultyProfile || null,
      mentor: user.mentor || null,
      company: user.company || null
    };
  }

  // ==================== STUDENT MANAGEMENT ====================

  /**
   * Get all students
   * GET /admin/students
   */
  async getStudents(params = {}) {
    try {
      const { page = 1, limit = 10, search, institutionId } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (institutionId) queryParams.append('institutionId', institutionId);

      const response = await api.get(`/admin/students?${queryParams.toString()}`);
      return {
        students: (response.data.students || []).map(student => this.normalizeStudent(student)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch students');
    }
  }

  /**
   * Create student
   * POST /admin/students
   */
  async createStudent(data) {
    try {
      const response = await api.post('/admin/students', data);
      return {
        success: true,
        message: response.data.message || 'Student created successfully',
        student: response.data.student
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create student');
    }
  }

  /**
   * Update student
   * PUT /admin/students/:studentId
   */
  async updateStudent(studentId, data) {
    try {
      const response = await api.put(`/admin/students/${studentId}`, data);
      return {
        success: true,
        message: response.data.message || 'Student updated successfully',
        student: response.data.student
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update student');
    }
  }

  /**
   * Delete student
   * DELETE /admin/students/:studentId
   */
  async deleteStudent(studentId) {
    try {
      const response = await api.delete(`/admin/students/${studentId}`);
      return {
        success: true,
        message: response.data.message || 'Student deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete student');
    }
  }

  normalizeStudent(student) {
    return {
      id: student.id,
      name: student.name || student.user?.displayName || 'Unknown',
      email: student.email || student.user?.email || '',
      phone: student.phone || student.user?.phone || '',
      enrollmentNumber: student.enrollmentNumber || '',
      department: student.department || '',
      semester: student.semester || 1,
      cgpa: student.cgpa || 0,
      institutionId: student.institutionId || null,
      institution: student.institution || null,
      userId: student.userId || null,
      user: student.user || null,
      createdAt: student.createdAt || new Date().toISOString()
    };
  }

  // ==================== FACULTY MANAGEMENT ====================

  /**
   * Get all faculty
   * GET /admin/faculty
   */
  async getFaculty(params = {}) {
    try {
      const { page = 1, limit = 10, search, institutionId } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (institutionId) queryParams.append('institutionId', institutionId);

      const response = await api.get(`/admin/faculty?${queryParams.toString()}`);
      return {
        faculty: (response.data.faculty || []).map(f => this.normalizeFaculty(f)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch faculty');
    }
  }

  /**
   * Create faculty
   * POST /admin/faculty
   */
  async createFaculty(data) {
    try {
      const response = await api.post('/admin/faculty', data);
      return {
        success: true,
        message: response.data.message || 'Faculty created successfully',
        faculty: response.data.faculty
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create faculty');
    }
  }

  /**
   * Update faculty
   * PUT /admin/faculty/:facultyId
   */
  async updateFaculty(facultyId, data) {
    try {
      const response = await api.put(`/admin/faculty/${facultyId}`, data);
      return {
        success: true,
        message: response.data.message || 'Faculty updated successfully',
        faculty: response.data.faculty
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update faculty');
    }
  }

  /**
   * Delete faculty
   * DELETE /admin/faculty/:facultyId
   */
  async deleteFaculty(facultyId) {
    try {
      const response = await api.delete(`/admin/faculty/${facultyId}`);
      return {
        success: true,
        message: response.data.message || 'Faculty deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete faculty');
    }
  }

  normalizeFaculty(faculty) {
    return {
      id: faculty.id,
      name: faculty.name || faculty.user?.displayName || 'Unknown',
      email: faculty.email || faculty.user?.email || '',
      phone: faculty.phone || faculty.user?.phone || '',
      employeeId: faculty.employeeId || '',
      department: faculty.department || '',
      designation: faculty.designation || '',
      specialization: faculty.specialization || '',
      institutionId: faculty.institutionId || null,
      institution: faculty.institution || null,
      userId: faculty.userId || null,
      user: faculty.user || null,
      createdAt: faculty.createdAt || new Date().toISOString()
    };
  }

  // ==================== INSTITUTION MANAGEMENT ====================
  
  /**
   * Get all institutions
   * GET /admin/institutions
   */
  async getInstitutions(params = {}) {
    try {
      const { page = 1, limit = 10, search } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/admin/institutions?${queryParams.toString()}`);
      return {
        institutions: (response.data.institutions || []).map(inst => this.normalizeInstitution(inst)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch institutions');
    }
  }

  /**
   * Create institution
   * POST /admin/institutions
   */
  async createInstitution(data) {
    try {
      const response = await api.post('/admin/institutions', data);
      return {
        success: true,
        message: response.data.message || 'Institution created successfully',
        institution: response.data.institution
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create institution');
    }
  }

  /**
   * Update institution
   * PUT /admin/institutions/:institutionId
   */
  async updateInstitution(institutionId, data) {
    try {
      const response = await api.put(`/admin/institutions/${institutionId}`, data);
      return {
        success: true,
        message: response.data.message || 'Institution updated successfully',
        institution: response.data.institution
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update institution');
    }
  }

  /**
   * Delete institution
   * DELETE /admin/institutions/:institutionId
   */
  async deleteInstitution(institutionId) {
    try {
      const response = await api.delete(`/admin/institutions/${institutionId}`);
      return {
        success: true,
        message: response.data.message || 'Institution deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete institution');
    }
  }

  normalizeInstitution(inst) {
    return {
      id: inst.id,
      name: inst.name || '',
      type: inst.type || '',
      address: inst.address || '',
      city: inst.city || '',
      state: inst.state || '',
      country: inst.country || '',
      postalCode: inst.postalCode || '',
      websiteUrl: inst.websiteUrl || '',
      createdAt: inst.createdAt || new Date().toISOString()
    };
  }

  // ==================== COMPANY MANAGEMENT ====================
  
  /**
   * Get all companies
   * GET /admin/companies
   */
  async getCompanies(params = {}) {
    try {
      const { page = 1, limit = 10, verified } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (verified !== undefined) queryParams.append('verified', verified);

      const response = await api.get(`/admin/companies?${queryParams.toString()}`);
      return {
        companies: (response.data.companies || []).map(company => this.normalizeCompany(company)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch companies');
    }
  }

  /**
   * Verify/Unverify company
   * PUT /admin/companies/:companyId/verify
   */
  async verifyCompany(companyId, isVerified) {
    try {
      const response = await api.put(`/admin/companies/${companyId}/verify`, { isVerified });
      return {
        success: true,
        message: response.data.message || `Company ${isVerified ? 'verified' : 'unverified'} successfully`,
        companyId,
        isVerified
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to verify company');
    }
  }

  /**
   * Delete company
   * DELETE /admin/companies/:companyId
   */
  async deleteCompany(companyId) {
    try {
      const response = await api.delete(`/admin/companies/${companyId}`);
      return {
        success: true,
        message: response.data.message || 'Company deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete company');
    }
  }

  /**
   * Update company
   * PUT /admin/companies/:companyId
   */
  async updateCompany(companyId, data) {
    try {
      const response = await api.put(`/admin/companies/${companyId}`, data);
      return {
        success: true,
        message: response.data.message || 'Company updated successfully',
        company: response.data.company
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update company');
    }
  }

  /**
   * Send message to company
   * POST /admin/companies/:companyId/send-message
   */
  async sendMessageToCompany(companyId, messageData) {
    try {
      const response = await api.post(`/admin/companies/${companyId}/send-message`, messageData);
      return {
        success: true,
        message: response.data.message || 'Message sent successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to send message to company');
    }
  }

  /**
   * Open company portal
   * PUT /admin/companies/:companyId/open-portal
   */
  async openCompanyPortal(companyId) {
    try {
      const response = await api.put(`/admin/companies/${companyId}/open-portal`);
      return {
        success: true,
        message: response.data.message || 'Company portal opened successfully',
        company: response.data.company
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to open company portal');
    }
  }

  normalizeCompany(company) {
    return {
      id: company.id,
      companyName: company.companyName || company.name || '',
      name: company.companyName || company.name || '',
      isVerified: company.isVerified || false,
      email: company.user?.email || '',
      createdAt: company.user?.createdAt || company.createdAt || new Date().toISOString(),
      internshipsCount: company._count?.internships || 0
    };
  }

  // ==================== COURSE MANAGEMENT ====================
  
  /**
   * Get all courses
   * GET /admin/courses
   */
  async getCourses(params = {}) {
    try {
      const { page = 1, limit = 10, search } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/admin/courses?${queryParams.toString()}`);
      return {
        courses: (response.data.courses || []).map(course => this.normalizeCourse(course)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch courses');
    }
  }

  /**
   * Create course
   * POST /admin/courses
   */
  async createCourse(data) {
    try {
      const response = await api.post('/admin/courses', data);
      return {
        success: true,
        message: response.data.message || 'Course created successfully',
        course: response.data.course
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create course');
    }
  }

  /**
   * Update course
   * PUT /admin/courses/:courseId
   */
  async updateCourse(courseId, data) {
    try {
      const response = await api.put(`/admin/courses/${courseId}`, data);
      return {
        success: true,
        message: response.data.message || 'Course updated successfully',
        course: response.data.course
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update course');
    }
  }

  /**
   * Delete course
   * DELETE /admin/courses/:courseId
   */
  async deleteCourse(courseId) {
    try {
      const response = await api.delete(`/admin/courses/${courseId}`);
      return {
        success: true,
        message: response.data.message || 'Course deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete course');
    }
  }

  normalizeCourse(course) {
    return {
      id: course.id,
      courseName: course.courseName || course.title || '',
      courseCode: course.courseCode || '',
      description: course.description || '',
      credits: course.credits || 0,
      semester: course.semester || 0,
      institutionName: course.institution?.name || '',
      enrollmentsCount: course._count?.enrollments || 0,
      createdAt: course.createdAt || new Date().toISOString()
    };
  }

  // ==================== INTERNSHIP MANAGEMENT ====================
  
  /**
   * Get all internships
   * GET /admin/internships
   */
  async getInternships(params = {}) {
    try {
      const { page = 1, limit = 10, active } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (active !== undefined) queryParams.append('active', active);

      const response = await api.get(`/admin/internships?${queryParams.toString()}`);
      return {
        internships: (response.data.internships || []).map(internship => this.normalizeInternship(internship)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch internships');
    }
  }

  /**
   * Approve/Reject internship
   * PUT /admin/internships/:internshipId/approve
   */
  async approveInternship(internshipId, isActive) {
    try {
      const response = await api.put(`/admin/internships/${internshipId}/approve`, { isActive });
      return {
        success: true,
        message: response.data.message || `Internship ${isActive ? 'approved' : 'rejected'} successfully`,
        internshipId,
        isActive
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to approve internship');
    }
  }

  /**
   * Delete internship
   * DELETE /admin/internships/:internshipId
   */
  async deleteInternship(internshipId) {
    try {
      const response = await api.delete(`/admin/internships/${internshipId}`);
      return {
        success: true,
        message: response.data.message || 'Internship deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete internship');
    }
  }

  normalizeInternship(internship) {
    return {
      id: internship.id,
      title: internship.title || '',
      companyName: internship.company?.companyName || '',
      isVerified: internship.company?.isVerified || false,
      isActive: internship.isActive || false,
      applicationsCount: internship._count?.applications || 0,
      createdAt: internship.createdAt || new Date().toISOString()
    };
  }

  // ==================== PARTNERSHIP MANAGEMENT ====================
  
  /**
   * Get all partnerships
   * GET /admin/partnerships
   */
  async getPartnerships(params = {}) {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);

      const response = await api.get(`/admin/partnerships?${queryParams.toString()}`);
      return {
        partnerships: (response.data.partnerships || []).map(p => this.normalizePartnership(p)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch partnerships');
    }
  }

  /**
   * Create partnership
   * POST /admin/partnerships
   */
  async createPartnership(data) {
    try {
      const response = await api.post('/admin/partnerships', data);
      return {
        success: true,
        message: response.data.message || 'Partnership created successfully',
        partnership: response.data.partnership
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create partnership');
    }
  }

  /**
   * Update partnership
   * PUT /admin/partnerships/:partnershipId
   */
  async updatePartnership(partnershipId, data) {
    try {
      const response = await api.put(`/admin/partnerships/${partnershipId}`, data);
      return {
        success: true,
        message: response.data.message || 'Partnership updated successfully',
        partnership: response.data.partnership
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update partnership');
    }
  }

  /**
   * Delete partnership
   * DELETE /admin/partnerships/:partnershipId
   */
  async deletePartnership(partnershipId) {
    try {
      const response = await api.delete(`/admin/partnerships/${partnershipId}`);
      return {
        success: true,
        message: response.data.message || 'Partnership deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete partnership');
    }
  }

  normalizePartnership(partnership) {
    return {
      id: partnership.id,
      institutionName: partnership.institution?.name || '',
      companyName: partnership.company?.companyName || '',
      partnershipType: partnership.partnershipType || '',
      startDate: partnership.startDate || null,
      endDate: partnership.endDate || null,
      description: partnership.description || '',
      status: partnership.status || 'ACTIVE',
      createdAt: partnership.createdAt || new Date().toISOString()
    };
  }

  // ==================== ANNOUNCEMENT MANAGEMENT ====================
  
  /**
   * Get all announcements
   * GET /admin/announcements
   */
  async getAnnouncements(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const response = await api.get(`/admin/announcements?${queryParams.toString()}`);
      return {
        announcements: (response.data.announcements || []).map(a => this.normalizeAnnouncement(a)),
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch announcements');
    }
  }

  /**
   * Create announcement
   * POST /admin/announcements
   */
  async createAnnouncement(data) {
    try {
      const response = await api.post('/admin/announcements', data);
      return {
        success: true,
        message: response.data.message || 'Announcement created successfully',
        announcement: response.data.announcement
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create announcement');
    }
  }

  /**
   * Update announcement
   * PUT /admin/announcements/:announcementId
   */
  async updateAnnouncement(announcementId, data) {
    try {
      const response = await api.put(`/admin/announcements/${announcementId}`, data);
      return {
        success: true,
        message: response.data.message || 'Announcement updated successfully',
        announcement: response.data.announcement
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update announcement');
    }
  }

  /**
   * Delete announcement
   * DELETE /admin/announcements/:announcementId
   */
  async deleteAnnouncement(announcementId) {
    try {
      const response = await api.delete(`/admin/announcements/${announcementId}`);
      return {
        success: true,
        message: response.data.message || 'Announcement deleted successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to delete announcement');
    }
  }

  normalizeAnnouncement(announcement) {
    return {
      id: announcement.id,
      title: announcement.title || '',
      content: announcement.content || '',
      targetAudience: announcement.targetAudience || 'ALL',
      priority: announcement.priority || 'NORMAL',
      expiresAt: announcement.expiresAt || null,
      createdBy: announcement.user?.displayName || '',
      createdByEmail: announcement.user?.email || '',
      createdAt: announcement.createdAt || new Date().toISOString()
    };
  }

  // ==================== REPORTS & ANALYTICS ====================
  
  /**
   * Get user analytics report
   * GET /admin/reports/users
   */
  async getUsersReport(params = {}) {
    try {
      const { startDate, endDate } = params;
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await api.get(`/admin/reports/users?${queryParams.toString()}`);
      return {
        totalUsers: response.data.totalUsers || 0,
        usersByRole: response.data.usersByRole || [],
        recentUsers: response.data.recentUsers || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user report');
    }
  }

  /**
   * Get internship analytics report
   * GET /admin/reports/internships
   */
  async getInternshipsReport(params = {}) {
    try {
      const { startDate, endDate } = params;
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await api.get(`/admin/reports/internships?${queryParams.toString()}`);
      return {
        totalInternships: response.data.totalInternships || 0,
        activeInternships: response.data.activeInternships || 0,
        totalApplications: response.data.totalApplications || 0,
        topInternships: response.data.topInternships || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch internship report');
    }
  }

  /**
   * Get course analytics report
   * GET /admin/reports/courses
   */
  async getCoursesReport(params = {}) {
    try {
      const { startDate, endDate } = params;
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await api.get(`/admin/reports/courses?${queryParams.toString()}`);
      return {
        totalCourses: response.data.totalCourses || 0,
        totalEnrollments: response.data.totalEnrollments || 0,
        popularCourses: response.data.popularCourses || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch course report');
    }
  }

  /**
   * Get platform activity report
   * GET /admin/reports/activity
   */
  async getActivityReport() {
    try {
      const response = await api.get('/admin/reports/activity');
      return {
        period: response.data.period || 'Last 30 days',
        newUsers: response.data.newUsers || 0,
        newInternships: response.data.newInternships || 0,
        newApplications: response.data.newApplications || 0,
        newEnrollments: response.data.newEnrollments || 0
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch activity report');
    }
  }

  // ==================== SYSTEM SETTINGS ====================
  
  /**
   * Get system settings
   * GET /admin/settings
   */
  async getSettings() {
    try {
      const response = await api.get('/admin/settings');
      return response.data.settings || this.getDefaultSettings();
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch system settings');
    }
  }

  /**
   * Update system settings
   * PUT /admin/settings
   */
  async updateSettings(data) {
    try {
      const response = await api.put('/admin/settings', data);
      return {
        success: true,
        message: response.data.message || 'Settings updated successfully',
        settings: response.data.settings
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to update system settings');
    }
  }

  getDefaultSettings() {
    return {
      platformName: 'EduSphere',
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: false,
      maxFileUploadSize: 10,
      sessionTimeout: 7,
      features: {
        internships: true,
        mentorSessions: true,
        courses: true,
        certificates: true
      }
    };
  }

  // ==================== EXPORT FUNCTIONS ====================

  /**
   * Export data by type
   * GET /admin/export/:type
   * @param {string} type - Type of data to export (users, students, faculty, companies, internships, courses, etc.)
   * @param {Object} params - Optional query parameters (format, startDate, endDate)
   */
  async exportData(type, params = {}) {
    try {
      const { format = 'csv', startDate, endDate } = params;
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await api.get(`/admin/export/${type}?${queryParams.toString()}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        // Return blob for file download
        return {
          success: true,
          data: response.data,
          filename: `${type}_export_${new Date().toISOString().split('T')[0]}.csv`
        };
      }

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Data exported successfully'
      };
    } catch (error) {
      throw this.handleError(error, `Failed to export ${type} data`);
    }
  }

  /**
   * Get export history
   * GET /admin/export/history
   */
  async getExportHistory(params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const response = await api.get(`/admin/export/history?${queryParams.toString()}`);
      return {
        exports: response.data.exports || [],
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch export history');
    }
  }

  /**
   * Helper function to download exported file
   * @param {Blob} blob - The file blob
   * @param {string} filename - The filename for download
   */
  downloadExportFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // ==================== PLACEMENT MANAGEMENT ====================

  /**
   * Get placement drives
   * GET /admin/placements/drives
   */
  async getPlacementDrives(params = {}) {
    try {
      const { page = 1, limit = 10, status } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (status) queryParams.append('status', status);

      const response = await api.get(`/admin/placements/drives?${queryParams.toString()}`);
      return {
        drives: response.data.drives || [],
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch placement drives');
    }
  }

  /**
   * Get ineligible students for placement
   * GET /admin/placements/ineligible-students
   */
  async getIneligibleStudents(params = {}) {
    try {
      const { page = 1, limit = 10, department, search } = params;
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (department) queryParams.append('department', department);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/admin/placements/ineligible-students?${queryParams.toString()}`);
      return {
        students: response.data.students || [],
        departments: response.data.departments || [],
        pagination: response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch ineligible students');
    }
  }

  /**
   * Force add student to placement drive (override eligibility)
   * POST /admin/placements/force-add
   */
  async forceAddStudent(data) {
    try {
      const response = await api.post('/admin/placements/force-add', data);
      return {
        success: true,
        message: response.data.message || 'Student force added successfully'
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to force add student');
    }
  }

  /**
   * Get departments list
   * GET /admin/departments
   */
  async getDepartments() {
    try {
      const response = await api.get('/admin/departments');
      return {
        departments: response.data.departments || []
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch departments');
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
const adminService = new AdminService();
export default adminService;

// Also export individual functions for convenience
export const {
  register,
  login,
  getDashboardStats,
  // User Management
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  // Student Management
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  // Faculty Management
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  // Institution Management
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  // Company Management
  getCompanies,
  verifyCompany,
  deleteCompany,
  updateCompany,
  sendMessageToCompany,
  openCompanyPortal,
  // Course Management
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  // Internship Management
  getInternships,
  approveInternship,
  deleteInternship,
  // Partnership Management
  getPartnerships,
  createPartnership,
  updatePartnership,
  deletePartnership,
  // Announcement Management
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  // Reports
  getUsersReport,
  getInternshipsReport,
  getCoursesReport,
  getActivityReport,
  // Settings
  getSettings,
  updateSettings,
  // Export Functions
  exportData,
  getExportHistory,
  downloadExportFile,
  // Placement Management
  getPlacementDrives,
  getIneligibleStudents,
  forceAddStudent,
  getDepartments
} = adminService;
