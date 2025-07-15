const { Employee } = require('../models/employee.model');
const { Attendance, AttendanceStatus } = require('../models/attendance.model');
const { Payroll } = require('../models/payroll.model');
const { PerformanceReview, PerformanceGoal, SkillAssessment } = require('../models/performance.model');
const { JobPosting, Application } = require('../models/recruitment.model');
const { NlpManager } = require('node-nlp');

// Initialize NLP manager for chatbot
const nlpManager = new NlpManager({ languages: ['en'] });
let isNlpTrained = false;

// Standard error response helper
const sendErrorResponse = (res, statusCode, message, error = null) => {
  console.error(`Error: ${message}`, error);
  res.status(statusCode).json({ 
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
  });
};

// Train NLP manager with intents and responses
const trainChatbot = async () => {
  if (isNlpTrained) {
    return;
  }

  try {
    // Leave-related intents
    nlpManager.addDocument('en', 'how many leave days do I have', 'leave.balance');
    nlpManager.addDocument('en', 'what is my leave balance', 'leave.balance');
    nlpManager.addDocument('en', 'check my remaining leaves', 'leave.balance');
    
    nlpManager.addDocument('en', 'how do I apply for leave', 'leave.apply');
    nlpManager.addDocument('en', 'I want to take time off', 'leave.apply');
    nlpManager.addDocument('en', 'request vacation', 'leave.apply');
    
    nlpManager.addDocument('en', 'what is the status of my leave request', 'leave.status');
    nlpManager.addDocument('en', 'has my leave been approved', 'leave.status');
    
    // Payroll-related intents
    nlpManager.addDocument('en', 'when will I get my salary', 'payroll.date');
    nlpManager.addDocument('en', 'salary payment date', 'payroll.date');
    
    nlpManager.addDocument('en', 'how to download payslip', 'payroll.download');
    nlpManager.addDocument('en', 'get my payslip', 'payroll.download');
    
    nlpManager.addDocument('en', 'explain my salary breakdown', 'payroll.breakdown');
    nlpManager.addDocument('en', 'what are the deductions in my salary', 'payroll.breakdown');
    
    // Attendance-related intents
    nlpManager.addDocument('en', 'how to mark attendance', 'attendance.mark');
    nlpManager.addDocument('en', 'check in procedure', 'attendance.mark');
    
    nlpManager.addDocument('en', 'how to apply for regularization', 'attendance.regularize');
    nlpManager.addDocument('en', 'forgot to mark attendance', 'attendance.regularize');
    
    // Add responses
    nlpManager.addAnswer('en', 'leave.balance', 'You can check your leave balance in the "My Leave" section of your dashboard.');
    nlpManager.addAnswer('en', 'leave.apply', 'To apply for leave, go to the "My Leave" section and click on "Apply Leave" button.');
    nlpManager.addAnswer('en', 'leave.status', 'You can check the status of your leave requests in the "My Leave" section under "Leave History".');
    
    nlpManager.addAnswer('en', 'payroll.date', 'Salaries are typically processed on the last working day of each month.');
    nlpManager.addAnswer('en', 'payroll.download', 'You can download your payslip from the "My Payroll" section of your dashboard.');
    nlpManager.addAnswer('en', 'payroll.breakdown', 'Your salary breakdown including all allowances and deductions can be viewed in the "My Payroll" section.');
    
    nlpManager.addAnswer('en', 'attendance.mark', 'You can mark your attendance by clicking on the "Check In" button in the "Attendance" section.');
    nlpManager.addAnswer('en', 'attendance.regularize', 'To apply for attendance regularization, go to the "Attendance" section and click on "Request Regularization".');
    
    // Train the model
    await nlpManager.train();
    isNlpTrained = true;
    console.log('NLP Manager trained successfully');
  } catch (error) {
    console.error('Error training NLP manager:', error);
  }
};

// Train the chatbot on startup
trainChatbot().catch(console.error);

// Process chatbot message
exports.processChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Message is required' 
      });
    }
    
    const response = await nlpManager.process('en', message);
    
    if (response.intent && response.score > 0.7) {
      return res.status(200).json({
        success: true,
        intent: response.intent,
        answer: response.answer,
        score: response.score
      });
    }
    
    return res.status(200).json({
      success: true,
      intent: 'none',
      answer: "I'm sorry, I don't understand that question. Please try rephrasing or contact support for assistance.",
      score: 0
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error processing chatbot message', error);
  }
};

// Parse resume
exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Resume file is required' 
      });
    }
    
    // Mock resume parsing result
    const result = {
      name: "John Doe",
      position: "Software Engineer",
      experience: [
        "Senior Software Engineer, Google (2018-2022)",
        "Software Engineer, Microsoft (2015-2018)"
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"],
      education: [
        "Master of Computer Science, Stanford University (2015)",
        "Bachelor of Computer Science, MIT (2013)"
      ],
      contact: {
        email: "john.doe@example.com",
        phone: "+1234567890"
      }
    };
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error parsing resume', error);
  }
};

// Generate AI insights
exports.generateInsights = async (req, res) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { type, employeeId } = req.body;
    
    // Validate required fields
    if (!tenantId) {
      return res.status(400).json({ 
        success: false,
        message: 'Tenant ID is required' 
      });
    }
    
    // Find employee
    const employee = await Employee.findOne({
      _id: employeeId || userId,
      tenantId
    });
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }
    
    let insights = [];
    
    switch (type) {
      case 'attendance':
        insights = await generateAttendanceInsights(employee._id);
        break;
      case 'performance':
        insights = await generatePerformanceInsights(employee._id);
        break;
      case 'payroll':
        insights = await generatePayrollInsights(employee._id);
        break;
      case 'recruitment':
        insights = await generateRecruitmentInsights();
        break;
      default:
        insights = await generateGeneralInsights(employee._id);
    }
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error generating insights', error);
  }
};

// Generate attendance insights
const generateAttendanceInsights = async (employeeId) => {
  try {
    // Get attendance records for the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: threeMonthsAgo }
    }).sort({ date: 1 });
    
    if (attendanceRecords.length === 0) {
      return [];
    }
    
    // Calculate statistics
    const totalRecords = attendanceRecords.length;
    const lateCount = attendanceRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const absentCount = attendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const presentCount = attendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    
    const latePercentage = totalRecords > 0 ? (lateCount / totalRecords) * 100 : 0;
    const absentPercentage = totalRecords > 0 ? (absentCount / totalRecords) * 100 : 0;
    const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
    
    // Generate insights
    const insights = [];
    
    // Attendance trend
    if (presentPercentage > 90) {
      insights.push({
        type: 'trend',
        title: 'Excellent Attendance Record',
        description: `You have an excellent attendance record with ${presentPercentage.toFixed(1)}% present days in the last 3 months.`,
        confidence: 0.9,
        actionable: false,
        priority: 'low',
        metadata: { trend: 'positive', metric: 'attendance' }
      });
    } else if (presentPercentage < 80) {
      insights.push({
        type: 'anomaly',
        title: 'Low Attendance Rate',
        description: `Your attendance rate is ${presentPercentage.toFixed(1)}% in the last 3 months, which is below the expected threshold.`,
        confidence: 0.85,
        actionable: true,
        priority: 'high',
        metadata: { trend: 'negative', metric: 'attendance' }
      });
    }
    
    // Late arrivals
    if (latePercentage > 20) {
      insights.push({
        type: 'anomaly',
        title: 'Frequent Late Arrivals',
        description: `You have been late ${lateCount} times in the last 3 months, which is ${latePercentage.toFixed(1)}% of your working days.`,
        confidence: 0.8,
        actionable: true,
        priority: 'medium',
        metadata: { trend: 'negative', metric: 'punctuality' }
      });
    }
    
    // Absence pattern
    if (absentPercentage > 10) {
      insights.push({
        type: 'anomaly',
        title: 'High Absence Rate',
        description: `You have been absent ${absentCount} times in the last 3 months, which is ${absentPercentage.toFixed(1)}% of your working days.`,
        confidence: 0.85,
        actionable: true,
        priority: 'high',
        metadata: { trend: 'negative', metric: 'absence' }
      });
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating attendance insights:', error);
    return [];
  }
};

// Generate performance insights
const generatePerformanceInsights = async (employeeId) => {
  try {
    // Get performance data
    const reviews = await PerformanceReview.find({ employeeId }).sort({ reviewDate: -1 }).limit(3);
    const goals = await PerformanceGoal.find({ employeeId }).sort({ createdAt: -1 });
    const skills = await SkillAssessment.find({ employeeId }).sort({ lastAssessedDate: -1 });
    
    const insights = [];
    
    // Performance trend
    if (reviews.length >= 2) {
      const latestReview = reviews[0];
      const previousReview = reviews[1];
      
      if (latestReview.overallRating > previousReview.overallRating) {
        insights.push({
          type: 'trend',
          title: 'Performance Improvement',
          description: `Your performance rating has improved from ${previousReview.overallRating} to ${latestReview.overallRating}.`,
          confidence: 0.9,
          actionable: false,
          priority: 'low',
          metadata: { trend: 'positive', metric: 'performance' }
        });
      } else if (latestReview.overallRating < previousReview.overallRating) {
        insights.push({
          type: 'anomaly',
          title: 'Performance Decline',
          description: `Your performance rating has decreased from ${previousReview.overallRating} to ${latestReview.overallRating}.`,
          confidence: 0.85,
          actionable: true,
          priority: 'high',
          metadata: { trend: 'negative', metric: 'performance' }
        });
      }
    }
    
    // Goal completion
    const completedGoals = goals.filter(g => g.status === 'completed');
    const inProgressGoals = goals.filter(g => g.status === 'in_progress');
    
    if (completedGoals.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Goal Achievement',
        description: `You have successfully completed ${completedGoals.length} performance goals.`,
        confidence: 0.85,
        actionable: false,
        priority: 'low',
        metadata: { trend: 'positive', metric: 'goals' }
      });
    }
    
    if (inProgressGoals.length > 0) {
      const overdueGoals = inProgressGoals.filter(g => new Date(g.targetDate) < new Date());
      
      if (overdueGoals.length > 0) {
        insights.push({
          type: 'anomaly',
          title: 'Overdue Goals',
          description: `You have ${overdueGoals.length} overdue goals that need attention.`,
          confidence: 0.8,
          actionable: true,
          priority: 'medium',
          metadata: { trend: 'negative', metric: 'goals' }
        });
      }
    }
    
    // Skill gaps
    if (skills.length > 0) {
      const skillGaps = skills.filter(s => s.currentLevel < s.targetLevel);
      
      if (skillGaps.length > 0) {
        insights.push({
          type: 'recommendation',
          title: 'Skill Development Opportunities',
          description: `You have ${skillGaps.length} skills that could benefit from further development.`,
          confidence: 0.8,
          actionable: true,
          priority: 'medium',
          metadata: { trend: 'neutral', metric: 'skills' }
        });
      }
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating performance insights:', error);
    return [];
  }
};

// Generate payroll insights
const generatePayrollInsights = async (employeeId) => {
  try {
    // Get payroll records for the last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const payrollRecords = await Payroll.find({
      employeeId,
      createdAt: { $gte: oneYearAgo }
    }).sort({ year: -1, month: -1 });
    
    if (payrollRecords.length === 0) {
      return [];
    }
    
    const insights = [];
    
    // Salary trend
    if (payrollRecords.length >= 2) {
      const latestPayroll = payrollRecords[0];
      const oldestPayroll = payrollRecords[payrollRecords.length - 1];
      
      if (oldestPayroll.netSalary > 0) {
        const salaryGrowth = ((latestPayroll.netSalary - oldestPayroll.netSalary) / oldestPayroll.netSalary) * 100;
        
        if (salaryGrowth > 0) {
          insights.push({
            type: 'trend',
            title: 'Salary Growth',
            description: `Your salary has grown by ${salaryGrowth.toFixed(1)}% over the last year.`,
            confidence: 0.9,
            actionable: false,
            priority: 'low',
            metadata: { trend: 'positive', metric: 'salary' }
          });
        }
      }
    }
    
    // Tax optimization
    const latestPayroll = payrollRecords[0];
    if (latestPayroll.grossSalary > 0) {
      const taxPercentage = (latestPayroll.tax / latestPayroll.grossSalary) * 100;
      
      if (taxPercentage > 15) {
        insights.push({
          type: 'recommendation',
          title: 'Tax Optimization Opportunity',
          description: `Your current tax rate is ${taxPercentage.toFixed(1)}%. Consider exploring tax-saving options.`,
          confidence: 0.75,
          actionable: true,
          priority: 'medium',
          metadata: { trend: 'neutral', metric: 'tax' }
        });
      }
    }
    
    // Deductions analysis
    if (latestPayroll.deductions && latestPayroll.deductions.length > 0) {
      const totalDeductions = latestPayroll.deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
      
      if (latestPayroll.grossSalary > 0) {
        const deductionPercentage = (totalDeductions / latestPayroll.grossSalary) * 100;
        
        if (deductionPercentage > 20) {
          insights.push({
            type: 'anomaly',
            title: 'High Deduction Rate',
            description: `Your deductions account for ${deductionPercentage.toFixed(1)}% of your gross salary, which is higher than average.`,
            confidence: 0.8,
            actionable: true,
            priority: 'medium',
            metadata: { trend: 'negative', metric: 'deductions' }
          });
        }
      }
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating payroll insights:', error);
    return [];
  }
};

// Generate recruitment insights
const generateRecruitmentInsights = async () => {
  try {
    // Get recruitment data
    const jobPostings = await JobPosting.find({ status: 'active' });
    const applications = await Application.find({}).populate('candidateId');
    
    const insights = [];
    
    // Application trends
    const applicationsByJob = {};
    applications.forEach(app => {
      if (app.jobId) {
        const jobId = app.jobId.toString();
        if (!applicationsByJob[jobId]) {
          applicationsByJob[jobId] = [];
        }
        applicationsByJob[jobId].push(app);
      }
    });
    
    for (const jobId in applicationsByJob) {
      const apps = applicationsByJob[jobId];
      const job = jobPostings.find(j => j._id.toString() === jobId);
      
      if (job && apps.length > 10) {
        insights.push({
          type: 'trend',
          title: 'High Application Volume',
          description: `The "${job.title}" position has received ${apps.length} applications.`,
          confidence: 0.85,
          actionable: true,
          priority: 'medium',
          metadata: { trend: 'positive', metric: 'applications' }
        });
      } else if (job && apps.length < 3) {
        insights.push({
          type: 'anomaly',
          title: 'Low Application Volume',
          description: `The "${job.title}" position has only received ${apps.length} applications.`,
          confidence: 0.8,
          actionable: true,
          priority: 'high',
          metadata: { trend: 'negative', metric: 'applications' }
        });
      }
    }
    
    // Candidate quality - Added null checks
    const highScoringCandidates = applications.filter(app => 
      app.candidateId && 
      app.candidateId.aiScore && 
      app.candidateId.aiScore >= 90
    );
    
    if (highScoringCandidates.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'High-Quality Candidates',
        description: `There are ${highScoringCandidates.length} candidates with AI match scores above 90%.`,
        confidence: 0.9,
        actionable: true,
        priority: 'high',
        metadata: { trend: 'positive', metric: 'candidates' }
      });
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating recruitment insights:', error);
    return [];
  }
};

// Generate general insights
const generateGeneralInsights = async (employeeId) => {
  try {
    // Combine insights from different areas
    const attendanceInsights = await generateAttendanceInsights(employeeId);
    const performanceInsights = await generatePerformanceInsights(employeeId);
    const payrollInsights = await generatePayrollInsights(employeeId);
    
    // Prioritize insights
    const allInsights = [
      ...attendanceInsights,
      ...performanceInsights,
      ...payrollInsights
    ];
    
    // Sort by priority and limit to 5
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return allInsights
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 5);
  } catch (error) {
    console.error('Error generating general insights:', error);
    return [];
  }
};

// Analyze attendance patterns
exports.analyzeAttendancePatterns = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { tenantId } = req.user;
    
    if (!employeeId) {
      return res.status(400).json({ 
        success: false,
        message: 'Employee ID is required' 
      });
    }
    
    // Find employee
    const employee = await Employee.findOne({
      _id: employeeId,
      tenantId
    });
    
    if (!employee) {
      return res.status(404).json({ 
        success: false,
        message: 'Employee not found' 
      });
    }
    
    // Get attendance records for the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: threeMonthsAgo }
    }).sort({ date: 1 });
    
    if (attendanceRecords.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No attendance records found' 
      });
    }
    
    // Calculate patterns
    const lateArrivals = attendanceRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const absentDays = attendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const totalWorkingDays = attendanceRecords.length;
    
    // Calculate overtime hours
    const overtimeHours = attendanceRecords.reduce((sum, r) => sum + (r.overtime || 0), 0);
    
    // Detect anomalies
    const anomalies = [];
    
    // Check for consecutive absences
    let consecutiveAbsences = 0;
    for (let i = 0; i < attendanceRecords.length; i++) {
      if (attendanceRecords[i].status === AttendanceStatus.ABSENT) {
        consecutiveAbsences++;
        if (consecutiveAbsences >= 3) {
          anomalies.push('Multiple consecutive absences detected');
          break;
        }
      } else {
        consecutiveAbsences = 0;
      }
    }
    
    // Check for pattern of late arrivals
    const daysOfWeek = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, ..., Sat
    
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const dayOfWeek = date.getDay();
      
      if (record.status === AttendanceStatus.LATE) {
        daysOfWeek[dayOfWeek]++;
      }
    });
    
    const maxLateDay = daysOfWeek.indexOf(Math.max(...daysOfWeek));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (daysOfWeek[maxLateDay] >= 3) {
      anomalies.push(`Frequent late arrivals on ${dayNames[maxLateDay]}`);
    }
    
    // Make predictions
    const attendanceRate = totalWorkingDays > 0 
      ? ((totalWorkingDays - absentDays) / totalWorkingDays) * 100 
      : 0;
    
    const predictedNextMonthAttendance = Math.min(100, attendanceRate + (attendanceRate > 90 ? 2 : -2));
    
    const riskScore = Math.min(100, 
      (totalWorkingDays > 0 ? (lateArrivals / totalWorkingDays) * 50 : 0) + 
      (totalWorkingDays > 0 ? (absentDays / totalWorkingDays) * 50 : 0)
    );
    
    res.status(200).json({
      success: true,
      data: {
        employeeId,
        patterns: {
          lateArrivals,
          absentDays,
          overtimeHours,
          attendanceRate: attendanceRate.toFixed(2)
        },
        anomalies,
        predictions: {
          nextMonthAttendance: predictedNextMonthAttendance.toFixed(2),
          riskScore: riskScore.toFixed(2)
        }
      }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error analyzing attendance patterns', error);
  }
};

// Predict payroll costs
exports.predictPayrollCosts = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { month, year } = req.body;
    
    // Check if user has permission
    if (role !== 'admin' && role !== 'hr') {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized to predict payroll costs' 
      });
    }
    
    // Validate required parameters
    if (!month || !year) {
      return res.status(400).json({ 
        success: false,
        message: 'Month and year are required' 
      });
    }
    
    if (month < 1 || month > 12) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid month value' 
      });
    }
    
    // Fixed the syntax error here - added space between < and 2000
    if (year < 2000 || year > 2100) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid year value' 
      });
    }
    
    // Get historical payroll data
    const historicalPayroll = await Payroll.find({ tenantId }).sort({ year: -1, month: -1 });
    
    if (historicalPayroll.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient historical data for prediction' 
      });
    }
    
    // Calculate average monthly growth rate
    const monthlyGrowthRates = [];
    
    for (let i = 0; i < historicalPayroll.length - 1; i++) {
      const current = historicalPayroll[i];
      const previous = historicalPayroll[i + 1];
      
      const currentTotal = current.grossSalary;
      const previousTotal = previous.grossSalary;
      
      if (previousTotal > 0) {
        const growthRate = (currentTotal - previousTotal) / previousTotal;
        monthlyGrowthRates.push(growthRate);
      }
    }
    
    if (monthlyGrowthRates.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Unable to calculate growth rate from historical data' 
      });
    }
    
    // Calculate average growth rate
    const avgGrowthRate = monthlyGrowthRates.reduce((sum, rate) => sum + rate, 0) / monthlyGrowthRates.length;
    
    // Get latest payroll total
    const latestPayroll = historicalPayroll[0];
    const latestTotal = latestPayroll.grossSalary;
    
    // Predict next month's payroll
    const predictedCost = latestTotal * (1 + avgGrowthRate);
    
    // Calculate variance
    const variance = Math.abs(avgGrowthRate * 100);
    
    // Generate recommendations
    const recommendations = [];
    
    if (avgGrowthRate > 0.05) {
      recommendations.push('Consider reviewing overtime policies');
      recommendations.push('Analyze salary structures for cost optimization');
    }
    
    if (variance > 10) {
      recommendations.push('High variance detected, consider budget adjustments');
    }
    
    res.status(200).json({
      success: true,
      data: {
        month: `${month}/${year}`,
        predictedCost,
        variance,
        recommendations,
        costOptimization: [
          'Implement flexible working hours',
          'Automate repetitive tasks',
          'Review contractor vs employee costs'
        ]
      }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error predicting payroll costs', error);
  }
};

// Categorize document
exports.categorizeDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Document file is required' 
      });
    }
    
    // Mock document text for demonstration
    const documentText = `
      EMPLOYMENT CERTIFICATE
      
      This is to certify that John Doe has been employed with our company
      as a Software Engineer from January 15, 2020 to December 31, 2022.
      
      During his tenure, he demonstrated excellent technical skills and
      was a valuable member of our team.
      
      For any further information, please contact HR department.
      
      Sincerely,
      HR Manager
    `;
    
    // Simple keyword-based categorization
    const categories = [
      { name: 'Employment Certificate', keywords: ['employment certificate', 'employed with', 'tenure'] },
      { name: 'Offer Letter', keywords: ['offer', 'position', 'pleased to offer', 'compensation'] },
      { name: 'Resignation Letter', keywords: ['resignation', 'resign', 'notice period', 'last day'] },
      { name: 'Payslip', keywords: ['salary', 'payslip', 'gross', 'net', 'deductions'] },
      { name: 'ID Document', keywords: ['identification', 'passport', 'driver', 'license', 'id card'] },
      { name: 'Educational Certificate', keywords: ['degree', 'university', 'college', 'graduate', 'education'] }
    ];
    
    let bestMatch = { name: 'Other', score: 0 };
    
    for (const category of categories) {
      let score = 0;
      
      for (const keyword of category.keywords) {
        if (documentText.toLowerCase().includes(keyword.toLowerCase())) {
          score++;
        }
      }
      
      const normalizedScore = category.keywords.length > 0 ? score / category.keywords.length : 0;
      
      if (normalizedScore > bestMatch.score) {
        bestMatch = { name: category.name, score: normalizedScore };
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        category: bestMatch.name,
        confidence: bestMatch.score.toFixed(2)
      }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Error categorizing document', error);
  }
};
