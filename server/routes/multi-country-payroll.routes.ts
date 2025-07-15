import express from 'express';
import {
  generatePayroll,
  processPayroll,
  markAsPaid,
  getPayrollRecords,
  getPayrollById,
  generateBulkPayroll,
  getPayrollStats,
  getTaxRules,
  updateTaxRules,
  getSupportedCountries
} from '../controllers/multi-country-payroll.controller.js';
import { authMiddleware, authorize } from '../middleware/auth.middleware.js';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/multi-country-payroll:
 *   post:
 *     summary: Generate payroll
 *     tags: [Multi-Country Payroll]
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
 *               - country
 *             properties:
 *               employeeId:
 *                 type: string
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payroll generated successfully
 */
router.post('/', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), generatePayroll);

/**
 * @swagger
 * /api/multi-country-payroll/bulk:
 *   post:
 *     summary: Generate bulk payroll
 *     tags: [Multi-Country Payroll]
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
 *               - country
 *             properties:
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               country:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bulk payroll generated successfully
 */
router.post('/bulk', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), generateBulkPayroll);

/**
 * @swagger
 * /api/multi-country-payroll/{id}/process:
 *   post:
 *     summary: Process payroll
 *     tags: [Multi-Country Payroll]
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
router.post('/:id/process', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), processPayroll);

/**
 * @swagger
 * /api/multi-country-payroll/{id}/paid:
 *   post:
 *     summary: Mark payroll as paid
 *     tags: [Multi-Country Payroll]
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
 *               paymentMethod:
 *                 type: string
 *               bankDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payroll marked as paid successfully
 */
router.post('/:id/paid', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), markAsPaid);

/**
 * @swagger
 * /api/multi-country-payroll:
 *   get:
 *     summary: Get payroll records
 *     tags: [Multi-Country Payroll]
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
 *         name: country
 *         schema:
 *           type: string
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
router.get('/', authMiddleware, getPayrollRecords);

/**
 * @swagger
 * /api/multi-country-payroll/stats:
 *   get:
 *     summary: Get payroll statistics
 *     tags: [Multi-Country Payroll]
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
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payroll statistics
 */
router.get('/stats', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), getPayrollStats);

/**
 * @swagger
 * /api/multi-country-payroll/countries:
 *   get:
 *     summary: Get supported countries
 *     tags: [Multi-Country Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supported countries
 */
router.get('/countries', authMiddleware, getSupportedCountries);

/**
 * @swagger
 * /api/multi-country-payroll/tax-rules/{country}:
 *   get:
 *     summary: Get tax rules for a country
 *     tags: [Multi-Country Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tax rules for the country
 */
router.get('/tax-rules/:country', authMiddleware, getTaxRules);

/**
 * @swagger
 * /api/multi-country-payroll/tax-rules/{country}:
 *   put:
 *     summary: Update tax rules for a country
 *     tags: [Multi-Country Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: country
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
 *         description: Tax rules updated successfully
 */
router.put('/tax-rules/:country', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), updateTaxRules);

/**
 * @swagger
 * /api/multi-country-payroll/{id}:
 *   get:
 *     summary: Get payroll by ID
 *     tags: [Multi-Country Payroll]
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
router.get('/:id', authMiddleware, getPayrollById);

export default router;
