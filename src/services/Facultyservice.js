// FILE: src/services/facultyService.js
import api from '../config/api';

class FacultyService {
  // ==================== DASHBOARD ====================
  
  async getDashboardStats() {
    try {
      // Aggregate data from multiple endpoints
      const classes = await this.getClasses();
      
      // Calculate stats from classes
      const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || cls.students || 0), 0);
      
      // Try to get more data for dashboard
      let recentReviews = [];
      let studentSnapshot = [];
      
      // Get students from first class if available
      if (classes.length > 0) {
        try {
          const firstClassStudents = await this.getStudentsInClass(classes[0].id);
          studentSnapshot = firstClassStudents.slice(0, 4).map(s => ({
            ...s,
            status: s.progress >= 80 ? 'Excelled' : s.progress >= 50 ? 'Active' : 'Behind'
          }));
        } catch (e) {
          console.log('Could not fetch students for dashboard');
        }
      }
      
      return {
        pendingReviews: 0,
        totalStudents: totalStudents,
        activeClasses: classes.length,
        avgAttendance: 0,
        recentReviews: recentReviews,
        studentSnapshot: studentSnapshot
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== CLASSES ====================
  
  async getClasses() {
    try {
      const response = await api.get('/faculty/classes');
      const data = response.data;
      
      // Handle different response formats
      const classes = Array.isArray(data) ? data : (data.classes || data.data || []);
      
      // Normalize class data to match frontend expectations
      return classes.map(cls => ({
        id: cls.id || cls._id,
        className: cls.name || cls.className,
        classCode: cls.code || cls.classCode,
        section: cls.section || '',
        studentCount: cls.students || cls.studentCount || 0,
        schedule: cls.schedule || '',
        semester: cls.semester || '',
        description: cls.description || ''
      }));
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getClassById(classId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}`);
      const cls = response.data.class || response.data;
      
      return {
        id: cls.id || cls._id,
        className: cls.name || cls.className,
        classCode: cls.code || cls.classCode,
        section: cls.section || '',
        studentCount: cls.students || cls.studentCount || 0,
        schedule: cls.schedule || '',
        semester: cls.semester || '',
        description: cls.description || ''
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createClass(classData) {
    try {
      // Transform frontend data to match backend expected format
      const backendData = {
        name: classData.className || classData.name,
        code: classData.classCode || classData.code,
        section: classData.section || null,
        semester: classData.semester || null,
        schedule: Array.isArray(classData.days) ? classData.days.join(', ') : (classData.schedule || null),
        description: classData.description || null
      };
      
      const response = await api.post('/faculty/classes', backendData);
      const result = response.data;
      
      // Handle response format: { success: true, class: {...} }
      const newClass = result.class || result;
      
      return {
        id: newClass.id || newClass._id,
        className: newClass.name || classData.className,
        classCode: newClass.code || classData.classCode,
        section: classData.section || '',
        studentCount: 0,
        schedule: Array.isArray(classData.days) ? classData.days.join(', ') : ''
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateClass(classId, classData) {
    try {
      // Transform frontend data to match backend expected format
      const backendData = {};
      if (classData.className || classData.name) backendData.name = classData.className || classData.name;
      if (classData.classCode || classData.code) backendData.code = classData.classCode || classData.code;
      if (classData.section !== undefined) backendData.section = classData.section;
      if (classData.semester !== undefined) backendData.semester = classData.semester;
      if (classData.schedule !== undefined) backendData.schedule = classData.schedule;
      if (classData.description !== undefined) backendData.description = classData.description;
      
      const response = await api.put(`/faculty/classes/${classId}`, backendData);
      const result = response.data;
      
      return {
        success: result.success !== false,
        class: result.class || result
      };
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
      const data = response.data;
      
      // Handle different response formats
      const students = Array.isArray(data) ? data : (data.students || data.data || []);
      
      // Normalize student data
      return students.map(student => ({
        id: student.id || student._id,
        name: student.name || student.displayName || student.studentName,
        rollNumber: student.enrollmentNumber || student.rollNumber || student.roll || 'N/A',
        email: student.email || '',
        progress: student.attendance || student.progress || 0
      }));
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async addStudentToClass(classId, studentData) {
    try {
      const backendData = {
        name: studentData.name,
        enrollmentNumber: studentData.rollNumber || studentData.enrollmentNumber,
        email: studentData.email || null
      };
      
      const response = await api.post(`/faculty/classes/${classId}/students`, backendData);
      const result = response.data;
      const student = result.student || result;
      
      return {
        id: student.id || student._id,
        name: student.name || studentData.name,
        rollNumber: student.enrollmentNumber || studentData.rollNumber,
        email: student.email || studentData.email || '',
        progress: 0
      };
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
      const data = response.data;
      
      // Handle different response formats
      const assignments = Array.isArray(data) ? data : (data.assignments || data.data || []);
      
      // Normalize assignment data
      return assignments.map(assignment => ({
        id: assignment.id || assignment._id,
        title: assignment.title || assignment.name,
        description: assignment.description || '',
        due: assignment.dueDate || assignment.due,
        dueDate: assignment.dueDate || assignment.due,
        category: assignment.type || assignment.category || 'Assignment',
        status: assignment.status || (assignment.published ? 'Published' : 'Draft'),
        maxMarks: assignment.maxMarks || 100,
        submissions: assignment.submissions || []
      }));
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createAssignment(classId, assignmentData) {
    try {
      // Transform to backend format
      const backendData = {
        title: assignmentData.title,
        description: assignmentData.description || '',
        dueDate: assignmentData.dueDate || assignmentData.due,
        maxMarks: assignmentData.maxMarks || 100,
        attachments: assignmentData.attachments || []
      };
      
      const response = await api.post(`/faculty/classes/${classId}/assignments`, backendData);
      const result = response.data;
      const assignment = result.assignment || result;
      
      return {
        id: assignment.id || assignment._id,
        title: assignment.title || assignmentData.title,
        due: assignment.dueDate || assignmentData.dueDate,
        dueDate: assignment.dueDate || assignmentData.dueDate,
        status: 'Draft',
        category: 'Assignment'
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateAssignment(assignmentId, assignmentData) {
    try {
      const backendData = {};
      if (assignmentData.title) backendData.title = assignmentData.title;
      if (assignmentData.description !== undefined) backendData.description = assignmentData.description;
      if (assignmentData.dueDate || assignmentData.due) backendData.dueDate = assignmentData.dueDate || assignmentData.due;
      if (assignmentData.maxMarks !== undefined) backendData.maxMarks = assignmentData.maxMarks;
      if (assignmentData.status) backendData.status = assignmentData.status;
      
      const response = await api.put(`/faculty/assignments/${assignmentId}`, backendData);
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
      const backendData = {
        marks: gradeData.marks || gradeData.grade,
        feedback: gradeData.feedback || gradeData.comments || ''
      };
      
      const response = await api.post(`/faculty/assignments/submissions/${submissionId}/grade`, backendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== ATTENDANCE ====================
  
  async markAttendance(classId, attendanceData) {
    try {
      // Transform to backend format: { date, attendance: [{ studentId, status }] }
      const backendData = {
        date: attendanceData.date,
        attendance: attendanceData.attendance || attendanceData.records || []
      };
      
      const response = await api.post(`/faculty/classes/${classId}/attendance`, backendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getAttendanceRecords(classId, date = null) {
    try {
      let url = `/faculty/classes/${classId}/attendance`;
      if (date) url += `?date=${date}`;
      
      const response = await api.get(url);
      const data = response.data;
      
      // Handle different response formats
      const records = Array.isArray(data) ? data : (data.attendance || data.records || data.data || []);
      
      return records.map(record => ({
        id: record.id || record._id,
        studentId: record.studentId,
        studentName: record.studentName || record.student?.name,
        date: record.date,
        status: record.status
      }));
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateAttendance(attendanceId, attendanceData) {
    try {
      const backendData = {
        status: attendanceData.status
      };
      
      const response = await api.put(`/faculty/attendance/${attendanceId}`, backendData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== PROFILE ====================
  
  async getProfile() {
    try {
      const response = await api.get('/faculty/profile');
      const data = response.data;
      const profile = data.profile || data.faculty || data;
      
      return {
        id: profile.id || profile._id,
        name: profile.name || profile.displayName,
        email: profile.email,
        department: profile.department || '',
        designation: profile.designation || '',
        phone: profile.phone || '',
        avatar: profile.avatar || profile.profileImage || ''
      };
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
      const data = response.data;
      
      return {
        totalStudents: data.totalStudents || 0,
        averageAttendance: data.averageAttendance || 0,
        averageGrade: data.averageGrade || 0,
        assignmentsCount: data.assignmentsCount || 0,
        submissionsCount: data.submissionsCount || 0,
        attendanceData: data.attendanceData || [],
        gradeDistribution: data.gradeDistribution || []
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getStudentPerformance(classId, studentId) {
    try {
      const response = await api.get(`/faculty/classes/${classId}/students/${studentId}/performance`);
      const data = response.data;
      const performance = data.performance || data;
      
      return {
        studentId: performance.studentId || studentId,
        studentName: performance.studentName || '',
        attendance: performance.attendance || 0,
        averageGrade: performance.averageGrade || 0,
        assignmentsCompleted: performance.assignmentsCompleted || 0,
        totalAssignments: performance.totalAssignments || 0,
        grades: performance.grades || [],
        attendanceHistory: performance.attendanceHistory || []
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new FacultyService();