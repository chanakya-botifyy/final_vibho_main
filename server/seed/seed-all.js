const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user.model');
const { Employee } = require('../models/employee.model');
const { LeaveBalance } = require('../models/leave.model');
const { LeaveRequest } = require('../models/leave.model');
const { Attendance } = require('../models/attendance.model');
const { Payroll } = require('../models/payroll.model');
const { Claim } = require('../models/claim.model');
const { Asset } = require('../models/asset.model');
const { Notification } = require('../models/notification.model');
const connectDB = require('../config/database');
const {
  users,
  createEmployeeData,
  createLeaveBalanceData,
  createAttendanceData,
  createLeaveRequestData,
  createPayrollData,
  createClaimData,
  createAssetData
} = require('./seed-data');
require('dotenv').config();

// Seed data
const seedAllData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await LeaveBalance.deleteMany({});
    await LeaveRequest.deleteMany({});
    await Attendance.deleteMany({});
    await Payroll.deleteMany({});
    await Claim.deleteMany({});
    await Asset.deleteMany({});
    await Notification.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users and related data
    for (const userData of users) {
      const { password, ...rest } = userData;
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = new User({
        ...rest,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`Created user: ${user.email}`);
      
      // Create employee for HR, Manager, and Employee roles
      if (user.role !== 'admin') {
        const employeeData = createEmployeeData(user);
        employeeData.userId = user._id;
        
        const employee = new Employee(employeeData);
        await employee.save();
        console.log(`Created employee: ${employee.employeeId}`);
        
        // Create leave balance
        const leaveBalanceData = createLeaveBalanceData(employee._id, user.tenantId);
        const leaveBalance = new LeaveBalance(leaveBalanceData);
        await leaveBalance.save();
        console.log(`Created leave balance for: ${employee.employeeId}`);
        
        // Create leave request
        const leaveRequestData = createLeaveRequestData(employee._id, user.tenantId);
        const leaveRequest = new LeaveRequest(leaveRequestData);
        await leaveRequest.save();
        console.log(`Created leave request for: ${employee.employeeId}`);
        
        // Create attendance records for the past 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Skip weekends
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;
          
          const attendanceData = createAttendanceData(employee._id, date, user.tenantId);
          const attendance = new Attendance(attendanceData);
          await attendance.save();
        }
        console.log(`Created attendance records for: ${employee.employeeId}`);
        
        // Create payroll record
        const payrollData = createPayrollData(employee._id, user.tenantId);
        const payroll = new Payroll(payrollData);
        await payroll.save();
        console.log(`Created payroll record for: ${employee.employeeId}`);
        
        // Create claim
        const claimData = createClaimData(employee._id, user.tenantId);
        const claim = new Claim(claimData);
        await claim.save();
        console.log(`Created claim for: ${employee.employeeId}`);
      }
    }
    
    // Create assets
    const asset = new Asset(createAssetData('tenant1'));
    await asset.save();
    console.log(`Created asset: ${asset.name}`);
    
    // Create notifications
    const employees = await Employee.find({});
    
    for (const employee of employees) {
      const user = await User.findById(employee.userId);
      
      // Create notification
      const notification = new Notification({
        userId: user._id,
        type: 'system_alert',
        title: 'Welcome to VibhoHCM',
        message: 'Welcome to VibhoHCM! We are excited to have you on board.',
        read: false,
        actionUrl: '/dashboard',
        tenantId: user.tenantId
      });
      
      await notification.save();
      console.log(`Created notification for: ${user.email}`);
    }
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAllData();