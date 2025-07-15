// Notification API service for VibhoHCM
// This file contains API calls and socket handling for notifications

import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = (userId: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token available for socket connection');
    return;
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  socket = io(baseUrl, {
    auth: {
      token
    },
    query: {
      userId
    }
  });
  
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  // Listen for notifications
  socket.on('notification', (notification) => {
    // Dispatch to notification store or handle directly
    console.log('Received notification:', notification);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png'
      });
    }
  });
  
  return socket;
};

// Close socket connection
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get all notifications
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/notifications', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread/count');
    return response.data.count;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences: any) => {
  try {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get notification preferences
export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/notifications/preferences');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Send test notification (for admin testing)
export const sendTestNotification = async (userId: string, notificationType: string) => {
  try {
    const response = await api.post('/notifications/test', { userId, notificationType });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};