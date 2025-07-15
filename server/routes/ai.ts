import express from 'express';
const router = express.Router();
import { protect, hasPermission } from '../middleware/auth.js';
import {
  processChatbotMessage,
  parseResume,
  generateInsights,
  analyzeAttendancePatterns,
  predictPayrollCosts,
  categorizeDocument
} from '../controllers/aiController.js';
import { PERMISSIONS } from '../utils/permissions.js';

// Protect all routes
router.use(protect);

// Chatbot route - available to all authenticated users
router.post('/chatbot', hasPermission(PERMISSIONS.AI_FEATURES_ACCESS), processChatbotMessage);

// Resume parsing - restricted to HR and Admin
router.post('/parse-resume', 
  hasPermission(PERMISSIONS.AI_RESUME_PARSER), 
  parseResume
);

// AI insights - available based on insight type
router.post('/insights', generateInsights);

// Attendance analytics
router.get('/attendance/:employeeId', 
  hasPermission(PERMISSIONS.AI_ATTENDANCE_ANALYTICS), 
  analyzeAttendancePatterns
);

// Payroll prediction - restricted to HR and Admin
router.post('/payroll/predict', 
  hasPermission(PERMISSIONS.AI_PAYROLL_PREDICTION), 
  predictPayrollCosts
);

// Document categorization
router.post('/document/categorize', 
  hasPermission(PERMISSIONS.AI_DOCUMENT_PROCESSOR), 
  categorizeDocument
);

export default router;
