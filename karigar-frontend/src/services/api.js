import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('karigar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (response?.status === 401) {
      localStorage.removeItem('karigar_token');
      localStorage.removeItem('karigar_user');
      window.location.href = '/login';
    }
    
    // Handle other errors
    if (response?.data) {
      return Promise.reject(response.data);
    }
    
    return Promise.reject({
      success: false,
      message: 'Network error. Please check your connection.',
    });
  }
);

export default api;