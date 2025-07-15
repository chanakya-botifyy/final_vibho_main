// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  designation?: string;
  employeeId?: string;
  tenantId: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin', // Has all permissions
  ADMIN = 'admin',             // System configuration and final approvals
  HR = 'hr',                   // Employee lifecycle management
  MANAGER = 'manager',         // Team management and first-level approvals
  EMPLOYEE = 'employee'        // Self-service functionality
}

export interface Employee {
  id: string;
  employeeId: string;
  personalInfo: PersonalInfo;
  companyInfo: CompanyInfo;
  bankInfo: BankInfo;
  documents: Document[];
  qualifications: Qualification[];
  previousEmployment: PreviousEmployment[];
  status: EmployeeStatus;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  nationality: string;
  address: Address;
  emergencyContact: EmergencyContact;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

interface CompanyInfo {
  department: string;
  designation: string;
  reportingManager: string;
  dateOfJoining: Date;
  employmentType: string;
  workLocation: string;
  shift: string;
  probationPeriod: number;
  confirmationDate?: Date;
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  ifscCode?: string;
  swiftCode?: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  expiryDate?: Date;
  verified: boolean;
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  NATIONAL_ID = 'national_id',
  VISA = 'visa',
  EDUCATION_CERTIFICATE = 'education_certificate',
  EXPERIENCE_LETTER = 'experience_letter',
  OFFER_LETTER = 'offer_letter',
  CONTRACT = 'contract'
}

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  grade: string;
  documents: Document[];
}

interface PreviousEmployment {
  id: string;
  company: string;
  designation: string;
  startDate: Date;
  endDate: Date;
  salary: number;
  reasonForLeaving: string;
  documents: Document[];
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ABSCONDED = 'absconded',
  ON_LEAVE = 'on_leave'
}

interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakTime: number;
  totalHours: number;
  overtime: number;
  status: AttendanceStatus;
  location?: GeoLocation;
  notes?: string;
  approvedBy?: string;
  createdAt: Date;
}

enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  WORK_FROM_HOME = 'work_from_home',
  ON_LEAVE = 'on_leave'
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Leave {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  documents: Document[];
}

enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  EMERGENCY = 'emergency',
  UNPAID = 'unpaid'
}

enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  maternity: number;
  paternity: number;
  emergency: number;
  year: number;
}

interface Payroll {
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
  country: string;
  paymentDate: Date;
  payslipUrl?: string;
  status: PayrollStatus;
}

interface PayrollComponent {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction';
  taxable: boolean;
}

enum PayrollStatus {
  DRAFT = 'draft',
  PROCESSED = 'processed',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  qrCode: string;
  assignedTo?: string;
  assignedDate?: Date;
  location: string;
  condition: AssetCondition;
  purchaseDate: Date;
  purchasePrice: number;
  warranty: Date;
  vendor: string;
  status: AssetStatus;
  maintenanceHistory: MaintenanceRecord[];
  documents: Document[];
}

enum AssetCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged'
}

enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  IN_REPAIR = 'in_repair',
  DISPOSED = 'disposed'
}

interface MaintenanceRecord {
  id: string;
  date: Date;
  description: string;
  cost: number;
  vendor: string;
  nextMaintenanceDate?: Date;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience: string;
  salary: SalaryRange;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed' | 'on_hold';
  postedDate: Date;
  closingDate: Date;
  applications: Application[];
}

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  resume: Document;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: Date;
  interviews: Interview[];
  rating?: number;
  notes?: string;
}

enum ApplicationStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected'
}

interface Interview {
  id: string;
  type: 'phone' | 'video' | 'in_person';
  date: Date;
  duration: number;
  interviewer: string;
  feedback?: string;
  rating?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume: Document;
  skills: string[];
  experience: number;
  currentSalary?: number;
  expectedSalary?: number;
  location: string;
  source: string;
  aiScore?: number;
  createdAt: Date;
}

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface Claim {
  id: string;
  employeeId: string;
  type: ClaimType;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  receipts: Document[];
  status: ClaimStatus;
  submittedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  reimbursementDate?: Date;
}

enum ClaimType {
  TRAVEL = 'travel',
  MEAL = 'meal',
  ACCOMMODATION = 'accommodation',
  MEDICAL = 'medical',
  COMMUNICATION = 'communication',
  TRAINING = 'training',
  OTHER = 'other'
}

enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  attendanceRate: number;
  leaveRequests: number;
  pendingApprovals: number;
  payrollProcessed: number;
  openPositions: number;
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
  metadata?: Record<string, any>;
}

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

enum NotificationType {
  LEAVE_REQUEST = 'leave_request',
  ATTENDANCE_ALERT = 'attendance_alert',
  PAYROLL_PROCESSED = 'payroll_processed',
  DOCUMENT_EXPIRY = 'document_expiry',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  SYSTEM_ALERT = 'system_alert'
}

interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

interface AppState {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}