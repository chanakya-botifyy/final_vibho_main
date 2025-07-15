import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshToken } from '../api/auth';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      try {
        // Try to refresh token
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
          // No refresh token, logout
          localStorage.removeItem('token');
          window.location.href = '/';
          return Promise.reject(error);
        }
        
        const response = await refreshToken();
        
        // Store new token
        localStorage.setItem('token', response.token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;