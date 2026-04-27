// src/services/authService.js
import axios from 'axios';

// Remove /api from here since your .env already includes it
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authService = {
  // Sign Up
  signup: async (fullname, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        fullname,
        email,
        password
      });
      
      console.log('Signup response:', response.data); // Debug log
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token saved to localStorage'); // Debug log
      } else {
        console.error('No token in response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Sign In
  signin: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signin`, {
        email,
        password
      });
      
      console.log('Signin response:', response.data); // Debug log
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token saved to localStorage'); // Debug log
      } else {
        console.error('No token in response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Signin error:', error.response?.data || error);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get user error:', error.response?.data || error);
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  // Upload profile image
  uploadProfileImage: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/auth/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.imageUrl) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.image = response.data.imageUrl;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload image' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('Checking auth, token exists:', !!token); // Debug log
    return !!token;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default authService;