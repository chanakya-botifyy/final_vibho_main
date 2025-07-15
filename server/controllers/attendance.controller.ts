import { Request, Response } from 'express';
import Attendance, { AttendanceStatus } from '../models/attendance.model';
import Employee from '../models/employee.model';
import { UserRole } from '../models/user.model';
import mongoose from 'mongoose';
import { differenceInMinutes, startOfDay, endOfDay } from 'date-fns';

// Check in
export const checkIn = async (req: Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { location, workLocation } = req.body;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if already checked in today
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      },
      tenantId
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Determine status based on check-in time
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const isLate = currentHour > 9 || (currentHour === 9 && currentMinute > 15);
    const status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    // Create or update attendance record
    if (existingAttendance) {
      existingAttendance.checkIn = today;
      existingAttendance.status = status;
      existingAttendance.location = location;
      existingAttendance.workLocation = workLocation;
      await existingAttendance.save();

      return res.status(200).json({
        message: 'Checked in successfully',
        attendance: existingAttendance
      });
    }

    const attendance = new Attendance({
      employeeId: employee._id,
      date: today,
      checkIn: today,
      breakTime: 0,
      totalHours: 0,
      overtime: 0,
      status,
      location,
      workLocation,
      tenantId
    });

    await attendance.save();

    res.status(201).json({
      message: 'Checked in successfully',
      attendance
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Check out
export const checkOut = async (req: Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find today's attendance record
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      },
      tenantId
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Must check in before checking out' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    // Update attendance record
    attendance.checkOut = today;
    
    // Calculate total hours
    const totalMinutes = differenceInMinutes(today, attendance.checkIn) - attendance.breakTime;
    attendance.totalHours = totalMinutes / 60;
    
    // Calculate overtime (assuming 8-hour workday)
    const standardHours = 8;
    attendance.overtime = Math.max(0, attendance.totalHours - standardHours);

    await attendance.save();

    res.status(200).json({
      message: 'Checked out successfully',
      attendance
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Start break
export const startBreak = async (req: Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find today's attendance record
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      },
      tenantId
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Must check in before starting break' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Cannot start break after checkout' });
    }

    // Update attendance record with break start time
    attendance.breakStartTime = today;
    await attendance.save();

    res.status(200).json({
      message: 'Break started successfully',
      breakStartTime: attendance.breakStartTime
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// End break
export const endBreak = async (req: Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find today's attendance record
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: startOfToday,
        $lte: endOfToday
      },
      tenantId
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (!attendance.breakStartTime) {
      return res.status(400).json({ message: 'No active break found' });
    }

    // Calculate break duration in minutes
    const breakDuration = differenceInMinutes(today, attendance.breakStartTime);
    
    // Update attendance record
    attendance.breakTime += breakDuration;
    attendance.breakStartTime = undefined;
    await attendance.save();

    res.status(200).json({
      message: 'Break ended successfully',
      breakDuration,
      totalBreakTime: attendance.breakTime
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Submit regularization request
export const submitRegularization = async (req: Request, res: Response) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { date, checkIn, checkOut, reason } = req.body;

    // Find employee
    const employee = await Employee.findOne({ userId, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Parse date
    const attendanceDate = new Date(date);
    const startOfDate = startOfDay(attendanceDate);
    const endOfDate = endOfDay(attendanceDate);

    // Find attendance record
    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: {
        $gte: startOfDate,
        $lte: endOfDate
      },
      tenantId
    });

    // Create attendance record if it doesn't exist
    if (!attendance) {
      attendance = new Attendance({
        employeeId: employee._id,
        date: attendanceDate,
        breakTime: 0,
        totalHours: 0,
        overtime: 0,
        status: AttendanceStatus.ABSENT,
        tenantId
      });
    }

    // Add regularization request
    attendance.regularizationRequest = {
      reason,
      requestedCheckIn: checkIn ? new Date(checkIn) : undefined,
      requestedCheckOut: checkOut ? new Date(checkOut) : undefined,
      status: 'pending'
    };

    await attendance.save();

    res.status(200).json({
      message: 'Regularization request submitted successfully',
      attendance
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Approve regularization request
export const approveRegularization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to approve regularization' });
    }

    // Find attendance record
    const attendance = await Attendance.findOne({
      _id: id,
      tenantId,
      'regularizationRequest.status': 'pending'
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Regularization request not found' });
    }

    // Update attendance record
    if (attendance.regularizationRequest?.requestedCheckIn) {
      attendance.checkIn = attendance.regularizationRequest.requestedCheckIn;
    }

    if (attendance.regularizationRequest?.requestedCheckOut) {
      attendance.checkOut = attendance.regularizationRequest.requestedCheckOut;
    }

    // Calculate total hours if both check-in and check-out are present
    if (attendance.checkIn && attendance.checkOut) {
      const totalMinutes = differenceInMinutes(attendance.checkOut, attendance.checkIn) - attendance.breakTime;
      attendance.totalHours = totalMinutes / 60;
      
      // Calculate overtime (assuming 8-hour workday)
      const standardHours = 8;
      attendance.overtime = Math.max(0, attendance.totalHours - standardHours);
      
      // Update status
      attendance.status = AttendanceStatus.PRESENT;
    }

    // Update regularization request
    if (attendance.regularizationRequest) {
      attendance.regularizationRequest.status = 'approved';
      attendance.regularizationRequest.approvedBy = new mongoose.Types.ObjectId(userId);
      attendance.regularizationRequest.approvedDate = new Date();
    }

    await attendance.save();

    res.status(200).json({
      message: 'Regularization request approved successfully',
      attendance
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Reject regularization request
export const rejectRegularization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId, tenantId, role } = req.user;
    const { reason } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR && role !== UserRole.MANAGER) {
      return res.status(403).json({ message: 'Unauthorized to reject regularization' });
    }

    // Find attendance record
    const attendance = await Attendance.findOne({
      _id: id,
      tenantId,
      'regularizationRequest.status': 'pending'
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Regularization request not found' });
    }

    // Update regularization request
    if (attendance.regularizationRequest) {
      attendance.regularizationRequest.status = 'rejected';
      attendance.regularizationRequest.approvedBy = new mongoose.Types.ObjectId(userId);
      attendance.regularizationRequest.approvedDate = new Date();
      attendance.regularizationRequest.rejectionReason = reason;
    }

    await attendance.save();

    res.status(200).json({
      message: 'Regularization request rejected successfully',
      attendance
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Get attendance records
export const getAttendanceRecords = async (req: Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, startDate, endDate, page = 1, limit = 31 } = req.query;

    // Build query
    const query: any = { tenantId };

    // Filter by employee
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      // If employee, only show their own records
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employeeId = employee._id;
    } else if (role === UserRole.MANAGER) {
      // If manager, only show their team's records
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
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const attendanceRecords = await Attendance.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId');

    // Get total count
    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      records: attendanceRecords,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req: Request, res: Response) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, month, year } = req.query;

    // Build query
    const query: any = { tenantId };

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
    }

    // Filter by month and year
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query);

    // Calculate statistics
    const stats = {
      totalDays: attendanceRecords.length,
      presentDays: attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status === AttendanceStatus.PRESENT).length,
      lateDays: attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status === AttendanceStatus.LATE).length,
      absentDays: attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status === AttendanceStatus.ABSENT).length,
      workFromHomeDays: attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status === AttendanceStatus.WORK_FROM_HOME).length,
      halfDays: attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status === AttendanceStatus.HALF_DAY).length,
      totalHours: attendanceRecords.reduce((sum: number, r: typeof attendanceRecords[0]) => sum + r.totalHours, 0),
      overtimeHours: attendanceRecords.reduce((sum: number, r: typeof attendanceRecords[0]) => sum + r.overtime, 0),
      attendanceRate: attendanceRecords.length > 0 
        ? ((attendanceRecords.filter((r: typeof attendanceRecords[0]) => r.status !== AttendanceStatus.ABSENT).length / attendanceRecords.length) * 100).toFixed(2)
        : 0
    };

    res.status(200).json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
