import api from '../config/api';

class AuthService {
  // ==================== STUDENT ====================
  
  async studentRegister(data) {
    try {
      const response = await api.post('/auth/student/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        enrollmentNumber: data.enrollmentNumber,
        phoneNumber: data.phoneNumber,
        branch: data.branch,
        year: data.year,
        semester: data.semester,
        college: data.college
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async studentLogin(email, password) {
    try {
      const response = await api.post('/auth/student/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== FACULTY ====================
  
  async facultyRegister(data) {
    try {
      const response = await api.post('/auth/faculty/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        employeeId: data.employeeId,
        department: data.department,
        phoneNumber: data.phoneNumber,
        designation: data.designation,
        college: data.college
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async facultyLogin(email, password) {
    try {
      const response = await api.post('/auth/faculty/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== MENTOR ====================
  
  async mentorRegister(data) {
    try {
      const response = await api.post('/auth/mentor/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        organization: data.organization,
        designation: data.designation,
        expertise: data.expertise,
        experience: data.experience,
        linkedIn: data.linkedIn,
        bio: data.bio
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async mentorLogin(email, password) {
    try {
      const response = await api.post('/auth/mentor/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== COMPANY ====================
  
  async companyRegister(data) {
    try {
      const response = await api.post('/company/register', {
        companyName: data.companyName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        website: data.website,
        officialEmail: data.officialEmail,
        contactName: data.contactName,
        industry: data.industry,
        description: data.description,
        location: data.location,
        phoneNumber: data.phoneNumber
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async companyLogin(email, password) {
    try {
      const response = await api.post('/company/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== ADMIN ====================
  
  async adminRegister(data) {
    try {
      const response = await api.post('/admin/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async adminLogin(email, password) {
    try {
      const response = await api.post('/admin/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==================== COMMON ====================
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();