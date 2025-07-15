// Authentication API service for VibhoHCM
// This file contains API calls for authentication

import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

// User registration
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// User login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Store tokens in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// User logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    return true;
  } catch (error) {
    // Still clear tokens even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    throw parseApiError(error);
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Store new token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // Clear tokens if refresh fails
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    throw parseApiError(error);
  }
};

// Request password reset
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update user profile
export const updateProfile = async (userData: any) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Verify email
export const verifyEmail = async (token: string) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};