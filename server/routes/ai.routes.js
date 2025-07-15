const express = require('express');
const multer = require('multer');
const {
  processChatbotMessage,
  parseResume,
  generateInsights,
  analyzeAttendancePatterns,
  predictPayrollCosts,
  categorizeDocument
} = require('../controllers/ai.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const { UserRole } = require('../models/user.model');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Process chatbot message
router.post('/chatbot', authMiddleware, processChatbotMessage);

// Parse resume
router.post('/parse-resume', authMiddleware, upload.single('resume'), parseResume);

// Generate AI insights
router.post('/insights', authMiddleware, generateInsights);

// Analyze attendance patterns
router.get('/attendance/:employeeId', authMiddleware, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER]), analyzeAttendancePatterns);

// Predict payroll costs
router.post('/payroll/predict', authMiddleware, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR]), predictPayrollCosts);

// Categorize document
router.post('/document/categorize', authMiddleware, upload.single('document'), categorizeDocument);

module.exports = router;

export default upload