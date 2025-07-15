import { Request, Response } from 'express';
import * as express from 'express';

import { Timesheet, TimesheetStatus } from '../models/timesheet.model';
import { Project } from '../models/project.model';
import Employee from '../models/employee.model';
import { UserRole } from '../models/user.model';
import mongoose from 'mongoose';
import { startOfWeek, endOfWeek } from 'date-fns';

// Create timesheet
export  const createTimesheet = async (req: express.Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { weekStartDate, entries } = req.body;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate week end date (7 days from start date)
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Check if timesheet already exists for this week
    const existingTimesheet = await Timesheet.findOne({
      employeeId: employee._id,
      weekStartDate: {
        $gte: startOfWeek(startDate),
        $lte: endOfWeek(startDate)
      },
      tenantId
    });

    if (existingTimesheet) {
      return res.status(400).json({ message: 'Timesheet already exists for this week' });
    }

    // Validate projects
    if (entries && entries.length > 0) {
      for (const entry of entries) {
        const project = await Project.findById(entry.project);
        if (!project) {
          return res.status(400).json({ message: `Project with ID ${entry.project} not found` });
        }
      }
    }

    // Create timesheet
    const timesheet = new Timesheet({
      employeeId: employee._id,
      weekStartDate: startDate,
      weekEndDate: endDate,
      entries: entries || [],
      status: TimesheetStatus.DRAFT,
      tenantId
    });

    await timesheet.save();

    res.status(201).json({
      message: 'Timesheet created successfully',
      timesheet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Update timesheet
export  const updateTimesheet = async (req: express.Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId } = req.user;
    const updates = req.body;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find timesheet
    const timesheet = await Timesheet.findOne({
      _id: id,
      employeeId: employee._id,
      tenantId,
      status: { $in: [TimesheetStatus.DRAFT, TimesheetStatus.REJECTED] }
    });

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found or cannot be updated' });
    }

    // Validate projects if entries are being updated
    if (updates.entries && updates.entries.length > 0) {
      for (const entry of updates.entries) {
        const project = await Project.findById(entry.project);
        if (!project) {
          return res.status(400).json({ message: `Project with ID ${entry.project} not found` });
        }
      }
    }

    // Update timesheet
    Object.keys(updates).forEach(key => {
      if (key !== 'status' && key !== 'approvedBy' && key !== 'approvedDate' && key !== 'submittedDate') {
        timesheet[key] = updates[key];
      }
    });

    await timesheet.save();

    res.status(200).json({
      message: 'Timesheet updated successfully',
      timesheet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Submit timesheet
export  const submitTimesheet = async (req: express.Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId } = req.user;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find timesheet
    const timesheet = await Timesheet.findOne({
      _id: id,
      employeeId: employee._id,
      tenantId,
      status: { $in: [TimesheetStatus.DRAFT, TimesheetStatus.REJECTED] }
    });

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found or cannot be submitted' });
    }

    // Check if timesheet has entries
    if (!timesheet.entries || timesheet.entries.length === 0) {
      return res.status(400).json({ message: 'Cannot submit empty timesheet' });
    }

    // Update timesheet status
    timesheet.status = TimesheetStatus.SUBMITTED;
    timesheet.submittedDate = new Date();

    await timesheet.save();

    res.status(200).json({
      message: 'Timesheet submitted successfully',
      timesheet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Approve timesheet
export  const approveTimesheet = async (req: express.Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to approve timesheets' });
    }

    // Find timesheet
    const timesheet = await Timesheet.findOne({
      _id: id,
      tenantId,
      status: TimesheetStatus.SUBMITTED
    }).populate('employeeId');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found or not submitted' });
    }

    // If manager, check if employee reports to them
    if (role === UserRole.MANAGER) {
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const employee = timesheet.employeeId;
      if (!employee || employee.companyInfo.reportingManager !== `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`) {
        return res.status(403).json({ message: 'Unauthorized to approve timesheet for this employee' });
      }
    }

    // Update timesheet status
    timesheet.status = TimesheetStatus.APPROVED;
    timesheet.approvedBy = new mongoose.Types.ObjectId(userId);
    timesheet.approvedDate = new Date();

    await timesheet.save();

    res.status(200).json({
      message: 'Timesheet approved successfully',
      timesheet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Reject timesheet
export  const rejectTimesheet = async (req: express.Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;
    const { reason } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to reject timesheets' });
    }

    // Find timesheet
    const timesheet = await Timesheet.findOne({
      _id: id,
      tenantId,
      status: TimesheetStatus.SUBMITTED
    }).populate('employeeId');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found or not submitted' });
    }

    // If manager, check if employee reports to them
    if (role === UserRole.MANAGER) {
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const employee = timesheet.employeeId;
      if (!employee || employee.companyInfo.reportingManager !== `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`) {
        return res.status(403).json({ message: 'Unauthorized to reject timesheet for this employee' });
      }
    }

    // Update timesheet status
    timesheet.status = TimesheetStatus.REJECTED;
    timesheet.rejectedBy = new mongoose.Types.ObjectId(userId);
    timesheet.rejectionReason = reason;

    await timesheet.save();

    res.status(200).json({
      message: 'Timesheet rejected successfully',
      timesheet
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Get timesheets
export  const getTimesheets = async (req: express.Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, status, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { tenantId };

    // Filter by employee
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      // If employee, only show their own timesheets
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employeeId = employee._id;
    } else if (role === UserRole.MANAGER) {
      // If manager, only show their team's timesheets
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const teamEmployees = await Employee.find({
        'companyInfo.reportingManager': manager.personalInfo.firstName + ' ' + manager.personalInfo.lastName,
        tenantId
      });

      const teamEmployeeIds = teamEmployees.map(emp => emp._id);
      query.employeeId = { $in: teamEmployeeIds };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.$or = [
        {
          weekStartDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        },
        {
          weekEndDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const timesheets = await Timesheet.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ weekStartDate: -1 })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('approvedBy', 'name');

    // Get total count
    const total = await Timesheet.countDocuments(query);

    res.status(200).json({
      timesheets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Get timesheet by ID
export  const getTimesheetById = async (req: express.Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId, role, id: userId } = req.user;

    // Find timesheet
    const timesheet = await Timesheet.findOne({
      _id: id,
      tenantId
    })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('approvedBy', 'name')
      .populate('entries.project', 'name code');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    // Check if user has permission to view this timesheet
    if (role === UserRole.EMPLOYEE) {
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee || !timesheet.employeeId.equals(employee._id)) {
        return res.status(403).json({ message: 'Unauthorized to view this timesheet' });
      }
    } else if (role === UserRole.MANAGER) {
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const employee = await Employee.findById(timesheet.employeeId);
      if (!employee || employee.companyInfo.reportingManager !== `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`) {
        return res.status(403).json({ message: 'Unauthorized to view timesheet for this employee' });
      }
    }

    res.status(200).json(timesheet);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

  
// Get timesheet statistics
export  const getTimesheetStats = async (req: express.Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, startDate, endDate } = req.query;

    // Build query
    const query = { tenantId };

    // Filter by employee
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      // If employee, only show their own stats
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employeeId = employee._id;
    } else if (role === UserRole.MANAGER) {
      // If manager, only show their team's stats
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const teamEmployees = await Employee.find({
        'companyInfo.reportingManager': manager.personalInfo.firstName + ' ' + manager.personalInfo.lastName,
        tenantId
      });

      const teamEmployeeIds = teamEmployees.map(emp => emp._id);
      query.employeeId = { $in: teamEmployeeIds };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.weekStartDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get timesheets
    const timesheets = await Timesheet.find(query);

    // Calculate statistics
    const stats = {
      totalTimesheets: timesheets.length,
      totalHours: timesheets.reduce((sum, t) => sum + t.totalHours, 0),
      billableHours: timesheets.reduce((sum, t) => sum + t.billableHours, 0),
      nonBillableHours: timesheets.reduce((sum, t) => sum + t.nonBillableHours, 0),
      averageHoursPerTimesheet: timesheets.length > 0 ? timesheets.reduce((sum, t) => sum + t.totalHours, 0) / timesheets.length : 0,
      statusCounts: {
        draft: timesheets.filter(t => t.status === TimesheetStatus.DRAFT).length,
        submitted: timesheets.filter(t => t.status === TimesheetStatus.SUBMITTED).length,
        approved: timesheets.filter(t => t.status === TimesheetStatus.APPROVED).length,
        rejected: timesheets.filter(t => t.status === TimesheetStatus.REJECTED).length
      }
    };

    // Calculate project distribution if not employee role
    if (role !== UserRole.EMPLOYEE) {
      const projectHours = {};
      
      for (const timesheet of timesheets) {
        for (const entry of timesheet.entries) {
          const projectId = entry.project.toString();
          if (!projectHours[projectId]) {
            projectHours[projectId] = 0;
          }
          projectHours[projectId] += entry.hours;
        }
      }
      
      // Get project details
      const projectDetails = [];
      for (const projectId in projectHours) {
        const project = await Project.findById(projectId);
        if (project) {
          projectDetails.push({
            id: projectId,
            name: project.name,
            code: project.code,
            hours: projectHours[projectId]
          });
        }
      }
      
      stats.projectDistribution = projectDetails.sort((a, b) => b.hours - a.hours);
    }

    res.status(200).json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};