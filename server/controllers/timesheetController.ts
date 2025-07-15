import { Request, Response } from 'express';
const Timesheet = require('../models/Timesheet');
const TimesheetEntry = require('../models/TimesheetEntry');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Employee = require('../models/Employee');
const logger = require('../utils/logger');
const { startOfWeek, endOfWeek, format } = require('date-fns');

/**
 * @desc    Submit timesheet entry
 * @route   POST /api/timesheet/entries
 * @access  Private
 */
exports.submitEntry = async (req: Request, res: Response) => {
  try {
    const { projectId, taskId, date, hours, description, billable } = req.body;
    
    // Validate input
    if (!projectId || !taskId || !date || !hours || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Check if project and task exist
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Get employee ID from user
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    const employee = await Employee.findOne({ email: (user as any).email });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Create timesheet entry
    const entry = await TimesheetEntry.create({
      employeeId: employee._id,
      projectId,
      taskId,
      date,
      hours,
      description,
      billable: billable || false,
      status: 'draft'
    });
    
    // Populate project and task names
    const populatedEntry = await TimesheetEntry.findById(entry._id)
      .populate('projectId', 'name')
      .populate('taskId', 'name');
    
    res.status(201).json({
      success: true,
      entry: {
        ...populatedEntry._doc,
        projectName: populatedEntry.projectId.name,
        taskName: populatedEntry.taskId.name
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Submit timesheet entry error: ${error.message}`);
    } else {
      logger.error('Submit timesheet entry error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update timesheet entry
 * @route   PUT /api/timesheet/entries/:id
 * @access  Private
 */
import { Request, Response } from 'express';

exports.updateEntry = async (req: Request, res: Response) => {
  try {
    const { projectId, taskId, hours, description, billable } = req.body;

    let entry = await TimesheetEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet entry not found',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const employee = await Employee.findOne({ email: (user as any).email });
    if (!employee || entry.employeeId.toString() !== employee._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this entry',
      });
    }

    if (entry.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update submitted or approved entries',
      });
    }

    const updates: { [key: string]: any } = {};
    if (projectId) updates.projectId = projectId;
    if (taskId) updates.taskId = taskId;
    if (hours) updates.hours = hours;
    if (description) updates.description = description;
    if (billable !== undefined) updates.billable = billable;

    entry = await TimesheetEntry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    const populatedEntry = await TimesheetEntry.findById(entry._id)
      .populate('projectId', 'name')
      .populate('taskId', 'name');

    res.status(200).json({
      success: true,
      entry: {
        ...populatedEntry._doc,
        projectName: populatedEntry.projectId.name,
        taskName: populatedEntry.taskId.name,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Update timesheet entry error: ${error.message}`);
    } else {
      logger.error('Update timesheet entry error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Delete timesheet entry
 * @route   DELETE /api/timesheet/entries/:id
 * @access  Private
 */
import { Request, Response } from 'express';

exports.deleteEntry = async (req: Request, res: Response) => {
  try {
    const entry = await TimesheetEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet entry not found',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const employee = await Employee.findOne({ email: (user as any).email });
    if (!employee || entry.employeeId.toString() !== employee._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this entry',
      });
    }

    if (entry.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete submitted or approved entries',
      });
    }

    await entry.remove();

    res.status(200).json({
      success: true,
      message: 'Timesheet entry deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Delete timesheet entry error: ${error.message}`);
    } else {
      logger.error('Delete timesheet entry error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Get timesheet entries
 * @route   GET /api/timesheet/entries
 * @access  Private
 */
import { Request, Response } from 'express';

exports.getEntries = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, employeeId, projectId } = req.query as {
      startDate?: string;
      endDate?: string;
      employeeId?: string;
      projectId?: string;
    };

    const query: { [key: string]: any } = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (projectId) {
      query.projectId = projectId;
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (employeeId) {
      if (['admin', 'hr'].includes(user.role || '')) {
        query.employeeId = employeeId;
      } else if (user.role === 'manager') {
        const teamMembers = await Employee.find({
          'companyInfo.reportingManager': (user as any).name,
        });

        const teamMemberIds = teamMembers.map((member: any) =>
          member._id.toString()
        );

        if (!teamMemberIds.includes(employeeId)) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to view this employee's timesheet",
          });
        }

        query.employeeId = employeeId;
      } else {
        const employee = await Employee.findOne({ email: (user as any).email });
        if (!employee) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found',
          });
        }

        if (employeeId !== employee._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "Not authorized to view this employee's timesheet",
          });
        }

        query.employeeId = employee._id;
      }
    } else {
      if (!['admin', 'hr'].includes(user.role || '')) {
        const employee = await Employee.findOne({ email: (user as any).email });
        if (!employee) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found',
          });
        }

        query.employeeId = employee._id;
      }
    }

    const entries = await TimesheetEntry.find(query)
      .populate('projectId', 'name')
      .populate('taskId', 'name')
      .sort({ date: -1 });

    const formattedEntries = entries.map((entry: any) => ({
      ...entry._doc,
      projectName: entry.projectId.name,
      taskName: entry.taskId.name,
    }));

    res.status(200).json({
      success: true,
      count: formattedEntries.length,
      entries: formattedEntries,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Get timesheet entries error: ${error.message}`);
    } else {
      logger.error('Get timesheet entries error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Submit timesheet for approval
 * @route   POST /api/timesheet/submit
 * @access  Private
 */
import { Request, Response } from 'express';

exports.submitForApproval = async (req: Request, res: Response) => {
  try {
    const { weekStartDate, comments } = req.body;

    if (!weekStartDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide week start date',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const employee = await Employee.findOne({ email: (user as any).email });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const startDate = new Date(weekStartDate);
    const endDate = endOfWeek(startDate);

    const entries = await TimesheetEntry.find({
      employeeId: employee._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: 'draft',
    });

    if (entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No draft entries found for the selected week',
      });
    }

    const totalHours = entries.reduce((sum: number, entry: any) => sum + entry.hours, 0);

    const timesheet = await Timesheet.create({
      employeeId: employee._id,
      weekStartDate: startDate,
      weekEndDate: endDate,
      totalHours,
      status: 'submitted',
      submittedAt: Date.now(),
      comments,
    });

    await TimesheetEntry.updateMany(
      { _id: { $in: entries.map((entry: any) => entry._id) } },
      { status: 'submitted' }
    );

    res.status(200).json({
      success: true,
      timesheet,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Submit timesheet error: ${error.message}`);
    } else {
      logger.error('Submit timesheet error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Approve timesheet
 * @route   POST /api/timesheet/:id/approve
 * @access  Private (Manager, HR, Admin)
 */
import { Request, Response } from 'express';

exports.approveTimesheet = async (req: Request, res: Response) => {
  try {
    const { comments } = req.body;

    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet not found',
      });
    }

    if (timesheet.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Only submitted timesheets can be approved',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (user.role === 'manager') {
      const employee = await Employee.findById(timesheet.employeeId);
      if (!employee || employee.companyInfo.reportingManager !== (user as any).name) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to approve this timesheet',
        });
      }
    } else if (!['admin', 'hr'].includes(user.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve timesheets',
      });
    }

    timesheet.status = 'approved';
    timesheet.approvedBy = (user as any).name;
    timesheet.approvedAt = Date.now();
    if (comments) timesheet.comments = comments;
    await timesheet.save();

    await TimesheetEntry.updateMany(
      {
        employeeId: timesheet.employeeId,
        date: {
          $gte: timesheet.weekStartDate,
          $lte: timesheet.weekEndDate,
        },
        status: 'submitted',
      },
      { status: 'approved' }
    );

    res.status(200).json({
      success: true,
      timesheet,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Approve timesheet error: ${error.message}`);
    } else {
      logger.error('Approve timesheet error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Reject timesheet
 * @route   POST /api/timesheet/:id/reject
 * @access  Private (Manager, HR, Admin)
 */
import { Request, Response } from 'express';

exports.rejectTimesheet = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rejection reason',
      });
    }

    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: 'Timesheet not found',
      });
    }

    if (timesheet.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Only submitted timesheets can be rejected',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (user.role === 'manager') {
      const employee = await Employee.findById(timesheet.employeeId);
      if (!employee || employee.companyInfo.reportingManager !== (user as any).name) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to reject this timesheet',
        });
      }
    } else if (!['admin', 'hr'].includes(user.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject timesheets',
      });
    }

    timesheet.status = 'rejected';
    timesheet.rejectedBy = (user as any).name;
    timesheet.rejectedAt = Date.now();
    timesheet.rejectionReason = reason;
    await timesheet.save();

    await TimesheetEntry.updateMany(
      {
        employeeId: timesheet.employeeId,
        date: {
          $gte: timesheet.weekStartDate,
          $lte: timesheet.weekEndDate,
        },
        status: 'submitted',
      },
      { status: 'rejected' }
    );

    res.status(200).json({
      success: true,
      timesheet,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Reject timesheet error: ${error.message}`);
    } else {
      logger.error('Reject timesheet error: Unknown error');
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Get timesheet summary
 * @route   GET /api/timesheet/summary
 * @access  Private
 */
exports.getTimesheetSummary = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, projectId } = req.query;
    
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end dates'
      });
    }
    
    // Build query
    const query = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    // Filter by project
    if (projectId) {
      query.projectId = projectId;
    }
    
    // Filter by employee
    if (employeeId) {
      // If admin or HR, allow filtering by any employee
      if (['admin', 'hr'].includes(req.user.role)) {
        query.employeeId = employeeId;
      } 
      // If manager, only allow filtering by team members
      else if (req.user.role === 'manager') {
        const teamMembers = await Employee.find({ 
          'companyInfo.reportingManager': req.user.name 
        });
        
        const teamMemberIds = teamMembers.map(member => member._id.toString());
        
        if (!teamMemberIds.includes(employeeId)) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to view this employee\'s timesheet'
          });
        }
        
        query.employeeId = employeeId;
      }
      // If employee, only allow viewing own entries
      else {
        const employee = await Employee.findOne({ email: req.user.email });
        if (!employee) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found'
          });
        }
        
        if (employeeId !== employee._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to view this employee\'s timesheet'
          });
        }
        
        query.employeeId = employee._id;
      }
    } else {
      // If no employeeId provided, restrict to user's entries if not admin/HR
      if (!['admin', 'hr'].includes(req.user.role)) {
        const employee = await Employee.findOne({ email: req.user.email });
        if (!employee) {
          return res.status(404).json({
            success: false,
            message: 'Employee not found'
          });
        }
        
        query.employeeId = employee._id;
      }
    }
    
    // Get entries
    const entries = await TimesheetEntry.find(query)
      .populate('projectId', 'name')
      .populate('taskId', 'name');
    
    // Calculate summary
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableHours = entries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
    const nonBillableHours = totalHours - billableHours;
    const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;
    
    // Calculate project summary
    const projectSummary = [];
    const projectMap = new Map();
    
    for (const entry of entries) {
      const projectId = entry.projectId._id.toString();
      const projectName = entry.projectId.name;
      
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          projectId,
          projectName,
          totalHours: 0,
          billableHours: 0
        });
      }
      
      const project = projectMap.get(projectId);
      project.totalHours += entry.hours;
      if (entry.billable) {
        project.billableHours += entry.hours;
      }
    }
    
    projectMap.forEach(project => {
      projectSummary.push(project);
    });
    
    res.status(200).json({
      success: true,
      summary: {
        totalHours,
        billableHours,
        nonBillableHours,
        billablePercentage,
        projectSummary
      }
    });
  } catch (error) {
    logger.error(`Get timesheet summary error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get projects for timesheet
 * @route   GET /api/timesheet/projects
 * @access  Private
 */
exports.getProjects = async (req, res) => {
  try {
    // Get active projects
    const projects = await Project.find({ status: 'active' })
      .select('name client description');
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    logger.error(`Get projects error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get tasks for a project
 * @route   GET /api/timesheet/projects/:projectId/tasks
 * @access  Private
 */
exports.getProjectTasks = async (req, res) => {
  try {
    // Check if project exists
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Get active tasks for the project
    const tasks = await Task.find({ 
      projectId: req.params.projectId,
      status: 'active'
    }).select('name description');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    logger.error(`Get project tasks error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Export timesheet
 * @route   GET /api/timesheet/export
 * @access  Private
 */
exports.exportTimesheet = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, format } = req.query;
    
    // Validate input
    if (!employeeId || !startDate || !endDate || !format) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId, startDate, endDate, and format'
      });
    }
    
    // Check if format is supported
    if (!['pdf', 'excel', 'csv'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Supported formats: pdf, excel, csv'
      });
    }
    
    // Check if user is authorized to export
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee || employee._id.toString() !== employeeId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to export this timesheet'
        });
      }
    } else if (req.user.role === 'manager') {
      const employee = await Employee.findById(employeeId);
      if (!employee || employee.companyInfo.reportingManager !== req.user.name) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to export this timesheet'
        });
      }
    }
    
    // Get entries
    const entries = await TimesheetEntry.find({
      employeeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('projectId', 'name')
      .populate('taskId', 'name')
      .sort({ date: 1 });
    
    // Get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Format entries
    const formattedEntries = entries.map(entry => ({
      date: format(new Date(entry.date), 'yyyy-MM-dd'),
      project: entry.projectId.name,
      task: entry.taskId.name,
      hours: entry.hours,
      billable: entry.billable ? 'Yes' : 'No',
      description: entry.description,
      status: entry.status
    }));
    
    // In a real app, generate file based on format
    // For now, just return the data
    res.status(200).json({
      success: true,
      data: {
        employee: {
          name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
          employeeId: employee.employeeId,
          department: employee.companyInfo.department,
          designation: employee.companyInfo.designation
        },
        period: {
          startDate: format(new Date(startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(endDate), 'yyyy-MM-dd')
        },
        entries: formattedEntries,
        summary: {
          totalHours: entries.reduce((sum, entry) => sum + entry.hours, 0),
          billableHours: entries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0)
        }
      }
    });
  } catch (error) {
    logger.error(`Export timesheet error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};