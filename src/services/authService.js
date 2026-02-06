/**
 * Authentication Service
 * Handles API calls for user authentication
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    // Mock implementation - replace with actual API call
    // const response = await api.post('/auth/login', { email, password });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    if (email === 'admin@church.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            name: 'Admin User',
            email: email,
            role: 'admin',
          },
        },
      };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    // Mock implementation - replace with actual API call
    // const response = await api.post('/auth/register', userData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'admin',
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Verify token
 */
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Mock implementation
    return {
      id: 1,
      name: 'Admin User',
      email: 'admin@christag.com',
      role: 'admin',
    };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

export default {
  login,
  register,
  logout,
  verifyToken,
};
