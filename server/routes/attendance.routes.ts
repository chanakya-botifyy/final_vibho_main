import express from 'express';
import {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  submitRegularization,
  approveRegularization,
  rejectRegularization,
  getAttendanceRecords,
  getAttendanceStats
} from '../controllers/attendance.controller';
import { authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     summary: Check in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - workLocation
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               workLocation:
 *                 type: string
 *                 enum: [office, home, client]
 *     responses:
 *       201:
 *         description: Checked in successfully
 */
router.post('/check-in', checkIn);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     summary: Check out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checked out successfully
 */
router.post('/check-out', checkOut);

/**
 * @swagger
 * /api/attendance/start-break:
 *   post:
 *     summary: Start break
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break started successfully
 */
router.post('/start-break', startBreak);

/**
 * @swagger
 * /api/attendance/end-break:
 *   post:
 *     summary: End break
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Break ended successfully
 */
router.post('/end-break', endBreak);

/**
 * @swagger
 * /api/attendance/regularization:
 *   post:
 *     summary: Submit regularization request
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - reason
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Regularization request submitted successfully
 */
router.post('/regularization', submitRegularization);

/**
 * @swagger
 * /api/attendance/regularization/{id}/approve:
 *   post:
 *     summary: Approve regularization request
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Regularization request approved successfully
 */
router.post('/regularization/:id/approve', authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), approveRegularization);

/**
 * @swagger
 * /api/attendance/regularization/{id}/reject:
 *   post:
 *     summary: Reject regularization request
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Regularization request rejected successfully
 */
router.post('/regularization/:id/reject', authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), rejectRegularization);

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of attendance records
 */
router.get('/', getAttendanceRecords);

/**
 * @swagger
 * /api/attendance/stats:
 *   get:
 *     summary: Get attendance statistics
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance statistics
 */
router.get('/stats', getAttendanceStats);

export default router;