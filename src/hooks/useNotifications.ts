// Notifications hook for VibhoHCM
// This hook provides access to user notifications and related functionality

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import * as notificationApi from '../api/notification';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  link?: string;
  metadata?: Record<string, any>;
}

export const useNotifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data);
        
        // Count unread notifications
        const unread = data.filter((notification: Notification) => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        // If API call fails, use mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock notification data - backend may not be running');
          const mockNotifications = [
            {
              id: '1',
              title: 'Leave Request Approved',
              message: 'Your leave request has been approved',
              type: 'success',
              read: false,
              timestamp: new Date()
            },
            {
              id: '2',
              title: 'Timesheet Reminder',
              message: 'Please submit your timesheet for this week',
              type: 'info',
              read: false,
              timestamp: new Date(Date.now() - 86400000)
            },
            {
              id: '3',
              title: 'Performance Review',
              message: 'Your quarterly performance review is scheduled',
              type: 'info',
              read: true,
              timestamp: new Date(Date.now() - 172800000)
            }
          ];
          
          setNotifications(mockNotifications);
          setUnreadCount(mockNotifications.filter(n => !n.read).length);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      try {
        const count = await notificationApi.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        // If API call fails, use mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock unread count - backend may not be running');
          setUnreadCount(2); // Mock unread count
        } else {
          throw error;
        }
      }
    } catch (error) {
      // Silently handle network errors for unread count
      // This prevents console spam when backend is not available
      if (process.env.NODE_ENV === 'development') {
        console.warn('Unable to fetch unread count - backend may not be running');
      }
    }
  }, [user]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      try {
        await notificationApi.markAsRead(notificationId);
      } catch (error) {
        // If API call fails, just update local state in development
        if (process.env.NODE_ENV !== 'development') {
          throw error;
        }
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      try {
        await notificationApi.markAllAsRead();
      } catch (error) {
        // If API call fails, just update local state in development
        if (process.env.NODE_ENV !== 'development') {
          throw error;
        }
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);
  
  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      try {
        await notificationApi.deleteNotification(notificationId);
      } catch (error) {
        // If API call fails, just update local state in development
        if (process.env.NODE_ENV !== 'development') {
          throw error;
        }
      }
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      
      // Update unread count if needed
      const wasUnread = notifications.find(n => n.id === notificationId)?.read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);
  
  // Initialize socket connection and fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      try {
        fetchNotifications();
        
        // Set up socket connection for real-time notifications
        try {
          const socket = notificationApi.initializeSocket(user.id);
          
          if (socket) {
            socket.on('notification', (newNotification: Notification) => {
              // Add new notification to state
              setNotifications(prev => [newNotification, ...prev]);
              
              // Update unread count
              if (!newNotification.read) {
                setUnreadCount(prev => prev + 1);
              }
              
              // Show browser notification if supported and permission granted
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(newNotification.title, {
                  body: newNotification.message,
                  icon: '/icon-192x192.png'
                });
              }
            });
          }
          
          // Clean up socket on unmount
          return () => {
            notificationApi.closeSocket();
          };
        } catch (error) {
          console.warn('Socket connection failed - backend may not be running');
          // Continue without socket connection in development
          if (process.env.NODE_ENV !== 'development') {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }
  }, [user?.id, fetchNotifications]);
  
  // Request notification permission if not already granted
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Set up polling for unread count
  useEffect(() => {
    if (user?.id) {
      const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [user?.id, fetchUnreadCount]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export default useNotifications;