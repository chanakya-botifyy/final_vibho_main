import express from 'express';
const router = express.Router();
import { protect, hasPermission } from '../middleware/auth.js';
import {
  submitEntry,
  updateEntry,
  deleteEntry,
  getEntries,
  submitForApproval,
  approveTimesheet,
  rejectTimesheet,
  getTimesheetSummary,
  getProjects,
  getProjectTasks,
  exportTimesheet
} from '../controllers/timesheetController.js';
import { PERMISSIONS } from '../utils/permissions.js';

// Protect all routes
router.use(protect);

// Timesheet entries routes
router.route('/entries')
  .post(hasPermission(PERMISSIONS.TIMESHEET_SUBMIT), submitEntry)
  .get(getEntries);

router.route('/entries/:id')
  .put(hasPermission(PERMISSIONS.TIMESHEET_SUBMIT), updateEntry)
  .delete(hasPermission(PERMISSIONS.TIMESHEET_SUBMIT), deleteEntry);

// Timesheet submission routes
router.post('/submit', hasPermission(PERMISSIONS.TIMESHEET_SUBMIT), submitForApproval);
router.post('/:id/approve', hasPermission(PERMISSIONS.TIMESHEET_APPROVE), approveTimesheet);
router.post('/:id/reject', hasPermission(PERMISSIONS.TIMESHEET_APPROVE), rejectTimesheet);

// Timesheet summary and reports
router.get('/summary', getTimesheetSummary);
router.get('/export', exportTimesheet);

// Projects and tasks
router.get('/projects', getProjects);
router.get('/projects/:projectId/tasks', getProjectTasks);

export default router;
