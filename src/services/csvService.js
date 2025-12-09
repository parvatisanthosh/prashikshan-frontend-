import api from '../config/api';

/**
 * csvService - API methods for CSV bulk registration and password management
 * Backend routes: /api/csv/*
 */
class CsvService {
  /**
   * Bulk register students from CSV
   * POST /csv/bulk-register
   * @param {FormData} formData - Must include 'csvFile' field
   */
  async bulkRegister(formData, token) {
    return api.post('/csv/bulk-register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      transformRequest: [(data) => data]
    });
  }

  /**
   * Login with temporary password
   * POST /csv/login
   */
  async login({ email, password }) {
    return api.post('/csv/login', { email, password });
  }

  /**
   * Change password
   * POST /csv/change-password
   */
  async changePassword({ currentPassword, newPassword, confirmNewPassword }) {
    return api.post('/csv/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
  }

  /**
   * Download CSV template
   * GET /csv/download-template
   */
  async downloadTemplate() {
    return api.get('/csv/download-template', { responseType: 'blob' });
  }
}

export default new CsvService();
