import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/user.model.ts';
import { Employee, EmployeeStatus } from '../models/employee.model.ts';
import { LeaveBalance } from '../models/leave.model.ts';
import connectDB from '../config/database.ts';
import dotenv from 'dotenv';
dotenv.config();

// Sample data
const users = [
  {
    email: 'admin@vibhohcm.com',
    password: 'password123',
    name: 'System Administrator',
    role: UserRole.ADMIN,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    department: 'IT',
    designation: 'System Administrator',
    employeeId: 'EMP001',
    tenantId: 'tenant1',
    isActive: true
  },
  {
    email: 'hr@vibhohcm.com',
    password: 'password123',
    name: 'Sarah Johnson',
    role: UserRole.HR,
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    department: 'Human Resources',
    designation: 'HR Manager',
    employeeId: 'EMP002',
    tenantId: 'tenant1',
    isActive: true
  },
  {
    email: 'manager@vibhohcm.com',
    password: 'password123',
    name: 'Michael Chen',
    role: UserRole.MANAGER,
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    department: 'Engineering',
    designation: 'Engineering Manager',
    employeeId: 'EMP003',
    tenantId: 'tenant1',
    isActive: true
  },
  {
    email: 'employee@vibhohcm.com',
    password: 'password123',
    name: 'Emily Rodriguez',
    role: UserRole.EMPLOYEE,
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    employeeId: 'EMP004',
    tenantId: 'tenant1',
    isActive: true
  }
];

// Seed data
const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await LeaveBalance.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users
    const createdUsers = [];
    
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
      createdUsers.push(user);
      
      console.log(`Created user: ${user.email}`);
      
      // Create employee for HR, Manager, and Employee roles
      if (user.role !== UserRole.ADMIN) {
        const employee = new Employee({
          employeeId: user.employeeId,
          userId: user._id,
          personalInfo: {
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
            email: user.email,
            phone: '+1-555-0123',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'Male',
            maritalStatus: 'Single',
            nationality: 'American',
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              country: 'USA',
              zipCode: '10001'
            },
            emergencyContact: {
              name: 'Jane Smith',
              relationship: 'Spouse',
              phone: '+1-555-0124'
            }
          },
          companyInfo: {
            department: user.department,
            designation: user.designation,
            reportingManager: user.role === UserRole.EMPLOYEE ? 'Michael Chen' : 'Admin User',
            dateOfJoining: new Date('2023-01-01'),
            employmentType: 'Full-time',
            workLocation: 'New York Office',
            shift: 'Day Shift',
            probationPeriod: 3,
            confirmationDate: new Date('2023-04-01')
          },
          bankInfo: {
            bankName: 'Chase Bank',
            accountNumber: '****1234',
            routingNumber: '021000021',
            accountType: 'Checking'
          },
          status: EmployeeStatus.ACTIVE,
          onboardingStep: 7,
          tenantId: user.tenantId
        });
        
        await employee.save();
        console.log(`Created employee: ${employee.employeeId}`);
        
        // Create leave balance
        const leaveBalance = new LeaveBalance({
          employeeId: employee._id,
          annual: { total: 21, used: 0, remaining: 21 },
          sick: { total: 12, used: 0, remaining: 12 },
          maternity: { total: 180, used: 0, remaining: 180 },
          paternity: { total: 15, used: 0, remaining: 15 },
          emergency: { total: 5, used: 0, remaining: 5 },
          year: new Date().getFullYear(),
          tenantId: user.tenantId
        });
        
        await leaveBalance.save();
        console.log(`Created leave balance for: ${employee.employeeId}`);
      }
    }
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();