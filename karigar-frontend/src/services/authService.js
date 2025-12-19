import api from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.success && response.token) {
        this.setAuthData(response.token, response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success && response.token) {
        this.setAuthData(response.token, response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('karigar_token');
    localStorage.removeItem('karigar_user');
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('karigar_user');
    return user ? JSON.parse(user) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('karigar_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.success && response.user) {
        localStorage.setItem('karigar_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Helper method to set auth data
  setAuthData(token, user) {
    localStorage.setItem('karigar_token', token);
    localStorage.setItem('karigar_user', JSON.stringify(user));
  }
}

export default new AuthService();