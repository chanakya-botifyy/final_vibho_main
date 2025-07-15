import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middleware/auth.middleware.ts';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Refresh token
router.post('/refresh', refreshToken);

// Change password
router.post('/change-password', authMiddleware, changePassword);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Logout
router.post('/logout', authMiddleware, logout);

export default router;
