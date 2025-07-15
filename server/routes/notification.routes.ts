const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
  getUnreadCount
} = require('../controllers/notification.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const { UserRole } = require('../models/user.model');

const router = express.Router();

// Get notifications
router.get('/', authMiddleware, getNotifications);

// Mark notification as read
router.put('/:id/read', authMiddleware, markAsRead);

// Mark all notifications as read
router.put('/read-all', authMiddleware, markAllAsRead);

// Delete notification
router.delete('/:id', authMiddleware, deleteNotification);

// Send notification
router.post('/send', authMiddleware, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), sendNotification);

// Get unread count
router.get('/unread-count', authMiddleware, getUnreadCount);

export default router;
