// Sample data for seeding the database
const { UserRole } = require('../models/user.model');
const { EmployeeStatus } = require('../models/employee.model');
const { AttendanceStatus } = require('../models/attendance.model');
const { LeaveType, LeaveStatus } = require('../models/leave.model');
const { PayrollStatus } = require('../models/payroll.model');
const { ClaimType, ClaimStatus } = require('../models/claim.model');
const { AssetCondition, AssetStatus } = require('../models/asset.model');

// Users
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

// Employees
const createEmployeeData = (user) => ({
  employeeId: user.employeeId,
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

// Leave balances
const createLeaveBalanceData = (employeeId, tenantId) => ({
  employeeId,
  annual: { total: 21, used: 0, remaining: 21 },
  sick: { total: 12, used: 0, remaining: 12 },
  maternity: { total: 180, used: 0, remaining: 180 },
  paternity: { total: 15, used: 0, remaining: 15 },
  emergency: { total: 5, used: 0, remaining: 5 },
  year: new Date().getFullYear(),
  tenantId
});

// Attendance records
const createAttendanceData = (employeeId, date, tenantId) => {
  const checkIn = new Date(date);
  checkIn.setHours(9, 0, 0, 0);
  
  const checkOut = new Date(date);
  checkOut.setHours(17, 30, 0, 0);
  
  return {
    employeeId,
    date,
    checkIn,
    checkOut,
    breakTime: 60,
    totalHours: 7.5,
    overtime: 0,
    status: AttendanceStatus.PRESENT,
    workLocation: 'office',
    tenantId
  };
};

// Leave requests
const createLeaveRequestData = (employeeId, tenantId) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);
  
  return {
    employeeId,
    type: LeaveType.ANNUAL,
    startDate,
    endDate,
    days: 3,
    reason: 'Family vacation',
    status: LeaveStatus.PENDING,
    appliedDate: new Date(),
    tenantId
  };
};

// Payroll records
const createPayrollData = (employeeId, tenantId) => {
  const currentDate = new Date();
  
  return {
    employeeId,
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    basicSalary: 75000,
    allowances: [
      { name: 'House Rent Allowance', amount: 30000, type: 'allowance', taxable: true },
      { name: 'Transport Allowance', amount: 5000, type: 'allowance', taxable: false },
      { name: 'Medical Allowance', amount: 2500, type: 'allowance', taxable: false }
    ],
    deductions: [
      { name: 'Provident Fund', amount: 9000, type: 'deduction', taxable: false },
      { name: 'Professional Tax', amount: 200, type: 'deduction', taxable: false }
    ],
    grossSalary: 112500,
    netSalary: 91175,
    tax: 12125,
    currency: 'INR',
    country: 'India',
    status: PayrollStatus.PAID,
    paymentDate: new Date(),
    tenantId
  };
};

// Claims
const createClaimData = (employeeId, tenantId) => {
  const currentDate = new Date();
  
  return {
    employeeId,
    type: ClaimType.TRAVEL,
    amount: 5000,
    currency: 'INR',
    description: 'Business trip to client site',
    date: currentDate,
    category: 'Business Travel',
    receipts: [
      {
        name: 'flight_receipt.pdf',
        url: 'https://example.com/receipts/flight_receipt.pdf',
        uploadDate: currentDate,
        size: 1024 * 1024 * 1.5,
        type: 'application/pdf',
        ocrProcessed: true,
        ocrData: {
          vendor: 'Air India',
          date: currentDate.toISOString().split('T')[0],
          amount: 5000
        }
      }
    ],
    status: ClaimStatus.SUBMITTED,
    submittedDate: currentDate,
    tenantId
  };
};

// Assets
const createAssetData = (tenantId) => {
  return {
    name: 'MacBook Pro 16"',
    category: 'Computer Equipment',
    serialNumber: 'MBP2023001',
    qrCode: 'QR001',
    location: 'New York Office',
    condition: AssetCondition.NEW,
    purchaseDate: new Date('2023-01-10'),
    purchasePrice: 2499,
    warranty: new Date('2025-01-10'),
    vendor: 'Apple Inc.',
    description: 'MacBook Pro with M3 chip, 32GB RAM, 1TB SSD',
    status: AssetStatus.AVAILABLE,
    maintenanceHistory: [],
    tenantId
  };
};

module.exports = {
  users,
  createEmployeeData,
  createLeaveBalanceData,
  createAttendanceData,
  createLeaveRequestData,
  createPayrollData,
  createClaimData,
  createAssetData
};