import express from 'express';
import {
  generatePayroll,
  processPayroll,
  markAsPaid,
  getPayrollRecords,
  getPayrollById,
  generateBulkPayroll,
  getPayrollStats
} from '../controllers/payroll.controller';
import { authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/payroll:
 *   post:
 *     summary: Generate payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - month
 *               - year
 *             properties:
 *               employeeId:
 *                 type: string
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payroll generated successfully
 */
router.post('/', authorize([UserRole.ADMIN, UserRole.HR]), generatePayroll);

/**
 * @swagger
 * /api/payroll/bulk:
 *   post:
 *     summary: Generate bulk payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bulk payroll generated successfully
 */
router.post('/bulk', authorize([UserRole.ADMIN, UserRole.HR]), generateBulkPayroll);

/**
 * @swagger
 * /api/payroll/{id}/process:
 *   post:
 *     summary: Process payroll
 *     tags: [Payroll]
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
 *         description: Payroll processed successfully
 */
router.post('/:id/process', authorize([UserRole.ADMIN, UserRole.HR]), processPayroll);

/**
 * @swagger
 * /api/payroll/{id}/paid:
 *   post:
 *     summary: Mark payroll as paid
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Payroll marked as paid successfully
 */
router.post('/:id/paid', authorize([UserRole.ADMIN, UserRole.HR]), markAsPaid);

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Get payroll records
 *     tags: [Payroll]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
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
 *         description: List of payroll records
 */
router.get('/', getPayrollRecords);

/**
 * @swagger
 * /api/payroll/stats:
 *   get:
 *     summary: Get payroll statistics
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Payroll statistics
 */
router.get('/stats', authorize([UserRole.ADMIN, UserRole.HR]), getPayrollStats);

/**
 * @swagger
 * /api/payroll/{id}:
 *   get:
 *     summary: Get payroll by ID
 *     tags: [Payroll]
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
 *         description: Payroll details
 *       404:
 *         description: Payroll not found
 */
router.get('/:id', getPayrollById);

export default router;
