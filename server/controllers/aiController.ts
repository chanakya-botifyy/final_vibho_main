const logger = require('../utils/logger');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Performance = require('../models/Performance');
const Recruitment = require('../models/Recruitment');
const Document = require('../models/Document');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    // Accept only certain file types
    const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed'));
  }
});

/**
 * @desc    Process chatbot message
 * @route   POST /api/ai/chatbot
 * @access  Private
 */
exports.processChatbotMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }
    
    // Get employee details if available
    let employeeContext = {};
    if (req.user.role === 'employee' || req.user.role === 'manager') {
      const employee = await Employee.findOne({ email: req.user.email });
      if (employee) {
        employeeContext = {
          employeeId: employee.employeeId,
          name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
          department: employee.companyInfo.department,
          designation: employee.companyInfo.designation,
          joiningDate: employee.companyInfo.dateOfJoining
        };
      }
    }
    
    // Process message using Python script (open source NLP model)
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../ai/chatbot.py'),
      message,
      JSON.stringify({ ...context, ...employeeContext, userRole: req.user.role })
    ]);
    
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      logger.error(`Chatbot error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Error processing message'
        });
      }
      
      try {
        const response = JSON.parse(result);
        res.status(200).json({
          success: true,
          answer: response.answer,
          entities: response.entities,
          intent: response.intent,
          confidence: response.confidence
        });
      } catch (error) {
        logger.error(`Error parsing chatbot response: ${error.message}`);
        res.status(500).json({
          success: false,
          message: 'Error processing message'
        });
      }
    });
  } catch (error) {
    logger.error(`Process chatbot message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Parse resume
 * @route   POST /api/ai/parse-resume
 * @access  Private (HR, Admin)
 */
exports.parseResume = async (req, res) => {
  try {
    // Use multer to handle file upload
    upload.single('resume')(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a resume'
        });
      }
      
      // Process resume using Python script (open source NLP model)
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '../ai/resume_parser.py'),
        req.file.path
      ]);
      
      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        logger.error(`Resume parser error: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        if (code !== 0) {
          return res.status(500).json({
            success: false,
            message: 'Error parsing resume'
          });
        }
        
        try {
          const parsedData = JSON.parse(result);
          res.status(200).json({
            success: true,
            data: parsedData
          });
        } catch (error) {
          logger.error(`Error parsing resume data: ${error.message}`);
          res.status(500).json({
            success: false,
            message: 'Error parsing resume'
          });
        }
      });
    });
  } catch (error) {
    logger.error(`Parse resume error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Generate AI insights
 * @route   POST /api/ai/insights
 * @access  Private
 */
exports.generateInsights = async (req, res) => {
  try {
    const { type, ...data } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide insight type'
      });
    }
    
    // Process insights using Python script (open source ML model)
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../ai/insights_generator.py'),
      type,
      JSON.stringify(data)
    ]);
    
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      logger.error(`Insights generator error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Error generating insights'
        });
      }
      
      try {
        const insights = JSON.parse(result);
        res.status(200).json({
          success: true,
          insights
        });
      } catch (error) {
        logger.error(`Error parsing insights: ${error.message}`);
        res.status(500).json({
          success: false,
          message: 'Error generating insights'
        });
      }
    });
  } catch (error) {
    logger.error(`Generate insights error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Analyze attendance patterns
 * @route   GET /api/ai/attendance/:employeeId
 * @access  Private (HR, Admin, Manager for team, Employee for self)
 */
exports.analyzeAttendancePatterns = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check authorization
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee || employee._id.toString() !== employeeId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this data'
        });
      }
    } else if (req.user.role === 'manager') {
      const employee = await Employee.findById(employeeId);
      if (!employee || employee.companyInfo.reportingManager !== req.user.name) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this data'
        });
      }
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({ employeeId })
      .sort({ date: -1 })
      .limit(90); // Last 90 days
    
    if (attendanceRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found'
      });
    }
    
    // Process attendance data using Python script (open source ML model)
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../ai/attendance_analytics.py'),
      JSON.stringify(attendanceRecords)
    ]);
    
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      logger.error(`Attendance analytics error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Error analyzing attendance patterns'
        });
      }
      
      try {
        const analysis = JSON.parse(result);
        res.status(200).json({
          success: true,
          data: analysis
        });
      } catch (error) {
        logger.error(`Error parsing attendance analysis: ${error.message}`);
        res.status(500).json({
          success: false,
          message: 'Error analyzing attendance patterns'
        });
      }
    });
  } catch (error) {
    logger.error(`Analyze attendance patterns error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Predict payroll costs
 * @route   POST /api/ai/payroll/predict
 * @access  Private (HR, Admin)
 */
exports.predictPayrollCosts = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and year'
      });
    }
    
    // Process payroll prediction using Python script (open source ML model)
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../ai/payroll_prediction.py'),
      month.toString(),
      year.toString()
    ]);
    
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      logger.error(`Payroll prediction error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Error predicting payroll costs'
        });
      }
      
      try {
        const prediction = JSON.parse(result);
        res.status(200).json({
          success: true,
          data: prediction
        });
      } catch (error) {
        logger.error(`Error parsing payroll prediction: ${error.message}`);
        res.status(500).json({
          success: false,
          message: 'Error predicting payroll costs'
        });
      }
    });
  } catch (error) {
    logger.error(`Predict payroll costs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Categorize document
 * @route   POST /api/ai/document/categorize
 * @access  Private
 */
exports.categorizeDocument = async (req, res) => {
  try {
    // Use multer to handle file upload
    upload.single('document')(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a document'
        });
      }
      
      // Process document using Python script (open source NLP model)
      const pythonProcess = spawn('python3', [
        path.join(__dirname, '../ai/document_processor.py'),
        req.file.path
      ]);
      
      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        logger.error(`Document processor error: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        if (code !== 0) {
          return res.status(500).json({
            success: false,
            message: 'Error categorizing document'
          });
        }
        
        try {
          const categorization = JSON.parse(result);
          res.status(200).json({
            success: true,
            data: categorization
          });
        } catch (error) {
          logger.error(`Error parsing document categorization: ${error.message}`);
          res.status(500).json({
            success: false,
            message: 'Error categorizing document'
          });
        }
      });
    });
  } catch (error) {
    logger.error(`Categorize document error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};