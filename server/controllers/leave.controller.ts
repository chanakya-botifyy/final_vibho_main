import { Request, Response } from 'express';
import { LeaveRequest, LeaveStatus, LeaveType, LeaveBalance } from '../models/leave.model';
import Employee from '../models/employee.model';
import { UserRole } from '../models/user.model';
import { isWeekend } from 'date-fns';
import mongoose from 'mongoose';

// Submit leave request
export const submitLeaveRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: userId, tenantId } = req.user;
    const { type, startDate, endDate, reason, documents } = req.body;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate number of days (excluding weekends)
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let days = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      if (!isWeekend(currentDate)) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (days <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid date range' });
    }

    // Check leave balance
    const currentYear = new Date().getFullYear();
    let leaveBalance = await LeaveBalance.findOne({
      employeeId: employee._id,
      year: currentYear,
      tenantId
    });

    if (!leaveBalance) {
      // Create default leave balance if not exists
      leaveBalance = new LeaveBalance({
        employeeId: employee._id,
        annual: { total: 21, used: 0, remaining: 21 },
        sick: { total: 12, used: 0, remaining: 12 },
        maternity: { total: 180, used: 0, remaining: 180 },
        paternity: { total: 15, used: 0, remaining: 15 },
        emergency: { total: 5, used: 0, remaining: 5 },
        year: currentYear,
        tenantId
      });
      await leaveBalance.save({ session });
    }

    // Check if enough balance available (except for unpaid leave)
    if (type !== LeaveType.UNPAID) {
      const balance = leaveBalance[type as keyof typeof leaveBalance] as { total: number; used: number; remaining: number };
      
      if (days > balance.remaining) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Insufficient ${type} leave balance. Available: ${balance.remaining} days, Requested: ${days} days` 
        });
      }
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      days,
      reason,
      status: LeaveStatus.PENDING,
      appliedDate: new Date(),
      documents,
      tenantId
    });

    await leaveRequest.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Approve leave request
export const approveLeaveRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Unauthorized to approve leave requests' });
    }

    // Find leave request
    const leaveRequest = await LeaveRequest.findOne({
      _id: id,
      tenantId,
      status: LeaveStatus.PENDING
    });

    if (!leaveRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Leave request not found or already processed' });
    }

    // If manager, check if employee reports to them
    if (role === UserRole.MANAGER) {
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Manager not found' });
      }

      const employee = await Employee.findById(leaveRequest.employeeId);
      if (!employee || employee.companyInfo.reportingManager !== `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Unauthorized to approve leave for this employee' });
      }
    }

    // Update leave request
    leaveRequest.status = LeaveStatus.APPROVED;
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(userId);
    leaveRequest.approvedDate = new Date();
    await leaveRequest.save({ session });

    // Update leave balance (except for unpaid leave)
    if (leaveRequest.type !== LeaveType.UNPAID) {
      const currentYear = new Date().getFullYear();
      const leaveBalance = await LeaveBalance.findOne({
        employeeId: leaveRequest.employeeId,
        year: currentYear,
        tenantId
      });

      if (leaveBalance) {
        const balanceField = leaveRequest.type as keyof typeof leaveBalance;
        const balance = leaveBalance[balanceField] as { total: number; used: number; remaining: number };
        
        balance.used += leaveRequest.days;
        balance.remaining = balance.total - balance.used;
        
        await leaveBalance.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Leave request approved successfully',
      leaveRequest
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Reject leave request
export const rejectLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;
    const { reason } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to reject leave requests' });
    }

    // Find leave request
    const leaveRequest = await LeaveRequest.findOne({
      _id: id,
      tenantId,
      status: LeaveStatus.PENDING
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found or already processed' });
    }

    // If manager, check if employee reports to them
    if (role === UserRole.MANAGER) {
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const employee = await Employee.findById(leaveRequest.employeeId);
      if (!employee || employee.companyInfo.reportingManager !== `${manager.personalInfo.firstName} ${manager.personalInfo.lastName}`) {
        return res.status(403).json({ message: 'Unauthorized to reject leave for this employee' });
      }
    }

    // Update leave request
    leaveRequest.status = LeaveStatus.REJECTED;
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(userId);
    leaveRequest.approvedDate = new Date();
    leaveRequest.rejectionReason = reason;
    await leaveRequest.save();

    res.status(200).json({
      message: 'Leave request rejected successfully',
      leaveRequest
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel leave request
export const cancelLeaveRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { id: userId, tenantId } = req.user;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find leave request
    const leaveRequest = await LeaveRequest.findOne({
      _id: id,
      employeeId: employee._id,
      tenantId,
      status: { $in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] }
    });

    if (!leaveRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Leave request not found or cannot be cancelled' });
    }

    // If leave was approved, restore leave balance
    if (leaveRequest.status === LeaveStatus.APPROVED && leaveRequest.type !== LeaveType.UNPAID) {
      const currentYear = new Date().getFullYear();
      const leaveBalance = await LeaveBalance.findOne({
        employeeId: leaveRequest.employeeId,
        year: currentYear,
        tenantId
      });

      if (leaveBalance) {
        const balanceField = leaveRequest.type as keyof typeof leaveBalance;
        const balance = leaveBalance[balanceField] as { total: number; used: number; remaining: number };
        
        balance.used -= leaveRequest.days;
        balance.remaining = balance.total - balance.used;
        
        await leaveBalance.save({ session });
      }
    }

    // Update leave request
    leaveRequest.status = LeaveStatus.CANCELLED;
    await leaveRequest.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Leave request cancelled successfully',
      leaveRequest
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// Get leave requests
export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, status, type, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { tenantId };

    // Filter by employee
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      // If employee, only show their own requests
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employeeId = employee._id;
    } else if (role === UserRole.MANAGER) {
      // If manager, only show their team's requests
      const manager = await Employee.findOne({ userId, tenantId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      const teamEmployees = await Employee.find({
        'companyInfo.reportingManager': manager.personalInfo.firstName + ' ' + manager.personalInfo.lastName,
        tenantId
      });

    const teamEmployeeIds = teamEmployees.map((emp: typeof teamEmployees[0]) => emp._id);
      query.employeeId = { $in: teamEmployeeIds };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.$or = [
        {
          startDate: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        },
        {
          endDate: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
          }
        },
        {
          $and: [
            { startDate: { $lte: new Date(startDate as string) } },
            { endDate: { $gte: new Date(endDate as string) } }
          ]
        }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const leaveRequests = await LeaveRequest.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ appliedDate: -1 })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId')
      .populate('approvedBy', 'name');

    // Get total count
    const total = await LeaveRequest.countDocuments(query);

    res.status(200).json({
      requests: leaveRequests,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave balance
export const getLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, year = new Date().getFullYear() } = req.query;

    // Determine which employee's balance to fetch
    let targetEmployeeId;

    if (employeeId) {
      // Check if user has permission to view this employee's balance
      if (role === UserRole.EMPLOYEE && userId !== employeeId) {
        return res.status(403).json({ message: 'Unauthorized to view this leave balance' });
      }
      targetEmployeeId = employeeId;
    } else {
      // Get current user's employee record
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      targetEmployeeId = employee._id;
    }

    // Find leave balance
    let leaveBalance = await LeaveBalance.findOne({
      employeeId: targetEmployeeId,
      year: Number(year),
      tenantId
    });

    if (!leaveBalance) {
      // Create default leave balance if not exists
      leaveBalance = new LeaveBalance({
        employeeId: targetEmployeeId,
        annual: { total: 21, used: 0, remaining: 21 },
        sick: { total: 12, used: 0, remaining: 12 },
        maternity: { total: 180, used: 0, remaining: 180 },
        paternity: { total: 15, used: 0, remaining: 15 },
        emergency: { total: 5, used: 0, remaining: 5 },
        year: Number(year),
        tenantId
      });
      await leaveBalance.save();
    }

    res.status(200).json(leaveBalance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update leave balance
export const updateLeaveBalance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const updates = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to update leave balance' });
    }

    // Find and update leave balance
    const leaveBalance = await LeaveBalance.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!leaveBalance) {
      return res.status(404).json({ message: 'Leave balance not found' });
    }

    res.status(200).json({
      message: 'Leave balance updated successfully',
      leaveBalance
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};