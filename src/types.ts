// Type definitions for VibhoHCM

// User roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

// Employee status
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  ABSCONDED = 'absconded'
}

// Document types
export enum DocumentType {
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  NATIONAL_ID = 'national_id',
  EDUCATION_CERTIFICATE = 'education_certificate',
  EXPERIENCE_LETTER = 'experience_letter',
  OFFER_LETTER = 'offer_letter',
  JOINING_LETTER = 'joining_letter',
  RELIEVING_LETTER = 'relieving_letter',
  SALARY_SLIP = 'salary_slip',
  TAX_DOCUMENT = 'tax_document',
  OTHER = 'other'
}

// Employee interface
export interface Employee {
  id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    maritalStatus: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  companyInfo: {
    department: string;
    designation: string;
    reportingManager: string;
    dateOfJoining: Date;
    employmentType: string;
    workLocation: string;
    shift: string;
    probationPeriod?: number;
    confirmationDate?: Date;
  };
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  };
  documents?: Document[];
  status: EmployeeStatus;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  expiryDate?: Date;
  verified: boolean;
}

// Attendance record interface
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day';
  location: 'office' | 'home' | 'client';
  workHours?: number;
  breakTime?: number;
  notes?: string;
}

// Leave request interface
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectedDate?: Date;
  rejectionReason?: string;
  cancelledDate?: Date;
  attachments?: string[];
}

// Payroll record interface
export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: PayrollComponent[];
  deductions: PayrollComponent[];
  grossSalary: number;
  netSalary: number;
  tax: number;
  currency: string;
  paymentDate?: Date;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
}

// Payroll component interface
export interface PayrollComponent {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction';
  taxable: boolean;
}

// Performance review interface
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  reviewDate: Date;
  reviewType: 'annual' | 'quarterly' | 'probation' | 'project';
  overallRating: number;
  strengths: string[];
  areasOfImprovement: string[];
  goals: PerformanceGoal[];
  trainingRecommendations: string[];
  status: 'draft' | 'in_progress' | 'completed' | 'acknowledged';
  managerComments?: string;
  employeeComments?: string;
  hrComments?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Performance goal interface
export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'project' | 'learning';
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  metrics: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Timesheet entry interface
export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: Date;
  projectId: string;
  projectName: string;
  taskId: string;
  taskName: string;
  hours: number;
  description: string;
  billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
  metadata?: Record<string, any>;
}

// API response interface
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API error interface
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Paginated response interface
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}