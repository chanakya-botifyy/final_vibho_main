import express from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
  addTeamMember,
  removeTeamMember,
  getProjectStats
} from '../controllers/project.controller.js';
import { authMiddleware, authorize } from '../middleware/auth.middleware.js';
import { UserRole } from '../models/user.model';

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
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
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               client:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               manager:
 *                 type: string
 *               team:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               billingType:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post('/', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *         description: Project updated successfully
 */
router.put('/:id', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 */
router.delete('/:id', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR]), deleteProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *       - in: query
 *         name: manager
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
 *         description: List of projects
 */
router.get('/', authMiddleware, getProjects);

/**
 * @swagger
 * /api/projects/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project statistics
 */
router.get('/stats', authMiddleware, getProjectStats);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
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
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:id', authMiddleware, getProjectById);

/**
 * @swagger
 * /api/projects/{id}/team:
 *   post:
 *     summary: Add team member to project
 *     tags: [Projects]
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
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team member added successfully
 */
router.post('/:id/team', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), addTeamMember);

/**
 * @swagger
 * /api/projects/{id}/team/{employeeId}:
 *   delete:
 *     summary: Remove team member from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member removed successfully
 */
router.delete('/:id/team/:employeeId', authMiddleware, authorize([UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), removeTeamMember);

export default router;
