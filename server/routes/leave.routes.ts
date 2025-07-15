import express from 'express';
import {
  submitLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
  getLeaveRequests,
  getLeaveBalance,
  updateLeaveBalance
} from '../controllers/leave.controller';
import { authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/leave:
 *   post:
 *     summary: Submit leave request
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [annual, sick, maternity, paternity, emergency, unpaid]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 */
router.post('/', submitLeaveRequest);

/**
 * @swagger
 * /api/leave/{id}/approve:
 *   post:
 *     summary: Approve leave request
 *     tags: [Leave]
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
 *         description: Leave request approved successfully
 */
router.post('/:id/approve', authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), approveLeaveRequest);

/**
 * @swagger
 * /api/leave/{id}/reject:
 *   post:
 *     summary: Reject leave request
 *     tags: [Leave]
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
 *         description: Leave request rejected successfully
 */
router.post('/:id/reject', authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), rejectLeaveRequest);

/**
 * @swagger
 * /api/leave/{id}/cancel:
 *   post:
 *     summary: Cancel leave request
 *     tags: [Leave]
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
 *         description: Leave request cancelled successfully
 */
router.post('/:id/cancel', cancelLeaveRequest);

/**
 * @swagger
 * /api/leave:
 *   get:
 *     summary: Get leave requests
 *     tags: [Leave]
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
 *         name: type
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
 *         description: List of leave requests
 */
router.get('/', getLeaveRequests);

/**
 * @swagger
 * /api/leave/balance:
 *   get:
 *     summary: Get leave balance
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave balance
 */
router.get('/balance', getLeaveBalance);

/**
 * @swagger
 * /api/leave/balance/{id}:
 *   put:
 *     summary: Update leave balance
 *     tags: [Leave]
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
 *         description: Leave balance updated successfully
 */
router.put('/balance/:id', authorize([UserRole.ADMIN, UserRole.HR]), updateLeaveBalance);

export default router;