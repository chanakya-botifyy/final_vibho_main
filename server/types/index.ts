// Define user roles
const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

// Define employee status
const EmployeeStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated',
  ABSCONDED: 'absconded',
  ON_LEAVE: 'on_leave'
};

// Define document types
const DocumentType = {
  PASSPORT: 'passport',
  DRIVING_LICENSE: 'driving_license',
  NATIONAL_ID: 'national_id',
  VISA: 'visa',
  EDUCATION_CERTIFICATE: 'education_certificate',
  EXPERIENCE_LETTER: 'experience_letter',
  OFFER_LETTER: 'offer_letter',
  CONTRACT: 'contract'
};

// Define attendance status
const AttendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  WORK_FROM_HOME: 'work_from_home',
  ON_LEAVE: 'on_leave'
};

// Define leave types
const LeaveType = {
  ANNUAL: 'annual',
  SICK: 'sick',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  EMERGENCY: 'emergency',
  UNPAID: 'unpaid'
};

// Define leave status
const LeaveStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// Define payroll status
const PayrollStatus = {
  DRAFT: 'draft',
  PROCESSED: 'processed',
  PAID: 'paid',
  CANCELLED: 'cancelled'
};

// Define asset conditions
const AssetCondition = {
  NEW: 'new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  DAMAGED: 'damaged'
};

// Define asset status
const AssetStatus = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  IN_REPAIR: 'in_repair',
  DISPOSED: 'disposed'
};

// Define application status
const ApplicationStatus = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected'
};

// Define claim types
const ClaimType = {
  TRAVEL: 'travel',
  MEAL: 'meal',
  ACCOMMODATION: 'accommodation',
  MEDICAL: 'medical',
  COMMUNICATION: 'communication',
  TRAINING: 'training',
  OTHER: 'other'
};

// Define claim status
const ClaimStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid'
};

// Define notification types
const NotificationType = {
  LEAVE_REQUEST: 'leave_request',
  ATTENDANCE_ALERT: 'attendance_alert',
  PAYROLL_PROCESSED: 'payroll_processed',
  DOCUMENT_EXPIRY: 'document_expiry',
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  SYSTEM_ALERT: 'system_alert'
};

module.exports = {
  UserRole,
  EmployeeStatus,
  DocumentType,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  PayrollStatus,
  AssetCondition,
  AssetStatus,
  ApplicationStatus,
  ClaimType,
  ClaimStatus,
  NotificationType
};