import express from 'express';
import {
  createClient,
  updateClient,
  deleteClient,
  getClients,
  getClientById,
  getClientStats
} from '../controllers/client.controller.js';
import { authMiddleware, authorize } from '../middleware/auth.middleware.js';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - contactPerson
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               contactPerson:
 *                 type: object
 *               company:
 *                 type: object
 *               billingInfo:
 *                 type: object
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 */
router.post('/', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
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
 *         description: Client updated successfully
 */
router.put('/:id', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
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
 *         description: Client deleted successfully
 */
router.delete('/:id', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), deleteClient);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
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
 *         description: List of clients
 */
router.get('/', authMiddleware, getClients);

/**
 * @swagger
 * /api/clients/stats:
 *   get:
 *     summary: Get client statistics
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client statistics
 */
router.get('/stats', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), getClientStats);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
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
 *         description: Client details
 *       404:
 *         description: Client not found
 */
router.get('/:id', authMiddleware, getClientById);

export default router;
