import express from 'express';
import {
  createTimesheet,
  updateTimesheet,
  submitTimesheet,
  approveTimesheet,
  rejectTimesheet,
  getTimesheets,
  getTimesheetById,
  getTimesheetStats
} from '../controllers/timesheet.controller.ts';
import { authMiddleware, authorize } from '../middleware/auth.middleware.ts';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/timesheets:
 *   post:
 *     summary: Create timesheet
 *     tags: [Timesheets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekStartDate
 *             properties:
 *               weekStartDate:
 *                 type: string
 *                 format: date
 *               entries:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Timesheet created successfully
 */
router.post('/', authMiddleware, createTimesheet);

/**
 * @swagger
 * /api/timesheets/{id}:
 *   put:
 *     summary: Update timesheet
 *     tags: [Timesheets]
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
 *     responses:
 *       200:
 *         description: Timesheet updated successfully
 */
router.put('/:id', authMiddleware, updateTimesheet);

/**
 * @swagger
 * /api/timesheets/{id}/submit:
 *   post:
 *     summary: Submit timesheet
 *     tags: [Timesheets]
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
 *         description: Timesheet submitted successfully
 */
router.post('/:id/submit', authMiddleware, submitTimesheet);

/**
 * @swagger
 * /api/timesheets/{id}/approve:
 *   post:
 *     summary: Approve timesheet
 *     tags: [Timesheets]
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
 *         description: Timesheet approved successfully
 */
router.post('/:id/approve', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), approveTimesheet);

/**
 * @swagger
 * /api/timesheets/{id}/reject:
 *   post:
 *     summary: Reject timesheet
 *     tags: [Timesheets]
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
 *         description: Timesheet rejected successfully
 */
router.post('/:id/reject', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), rejectTimesheet);

/**
 * @swagger
 * /api/timesheets:
 *   get:
 *     summary: Get timesheets
 *     tags: [Timesheets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
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
 *         description: List of timesheets
 */
router.get('/', authMiddleware, getTimesheets);

/**
 * @swagger
 * /api/timesheets/stats:
 *   get:
 *     summary: Get timesheet statistics
 *     tags: [Timesheets]
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
 *     responses:
 *       200:
 *         description: Timesheet statistics
 */
router.get('/stats', authMiddleware, getTimesheetStats);

/**
 * @swagger
 * /api/timesheets/{id}:
 *   get:
 *     summary: Get timesheet by ID
 *     tags: [Timesheets]
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
 *         description: Timesheet details
 *       404:
 *         description: Timesheet not found
 */
router.get('/:id', authMiddleware, getTimesheetById);

export default router;
