// Application Constants
export const APP_CONFIG = {
  APP_NAME: 'VibhoHCM',
  VERSION: '1.0.0',
  COMPANY: 'VibhoHCM Solutions',
  DESCRIPTION: 'Enterprise Human Resource Management System',
  SUPPORT_EMAIL: 'support@vibhohcm.com',
  DOCUMENTATION_URL: 'https://docs.vibhohcm.com'
};

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api',
  AUTH: '/auth',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  LEAVE: '/leave',
  PAYROLL: '/payroll',
  RECRUITMENT: '/recruitment',
  ASSETS: '/assets',
  CLAIMS: '/claims',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme_mode',
  LANGUAGE: 'selected_language'
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
} as const;

export const PERMISSIONS = {
  // Employee Management
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_DELETE: 'employee:delete',
  
  // Attendance
  ATTENDANCE_VIEW_ALL: 'attendance:view_all',
  ATTENDANCE_VIEW_TEAM: 'attendance:view_team',
  ATTENDANCE_VIEW_OWN: 'attendance:view_own',
  ATTENDANCE_APPROVE: 'attendance:approve',
  
  // Leave Management
  LEAVE_VIEW_ALL: 'leave:view_all',
  LEAVE_VIEW_TEAM: 'leave:view_team',
  LEAVE_APPROVE: 'leave:approve',
  LEAVE_REJECT: 'leave:reject',
  
  // Payroll
  PAYROLL_PROCESS: 'payroll:process',
  PAYROLL_VIEW: 'payroll:view',
  PAYROLL_APPROVE: 'payroll:approve',
  
  // Reports
  REPORTS_VIEW_ALL: 'reports:view_all',
  REPORTS_VIEW_TEAM: 'reports:view_team',
  REPORTS_EXPORT: 'reports:export',
  
  // Settings
  SETTINGS_MANAGE: 'settings:manage',
  SETTINGS_VIEW: 'settings:view'
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_APPROVE,
    PERMISSIONS.REPORTS_VIEW_ALL,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SETTINGS_VIEW
  ],
  [ROLES.HR]: [
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.REPORTS_VIEW_ALL,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.ATTENDANCE_VIEW_TEAM,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_TEAM,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_REJECT,
    PERMISSIONS.REPORTS_VIEW_TEAM,
    PERMISSIONS.SETTINGS_VIEW
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.ATTENDANCE_VIEW_OWN,
    PERMISSIONS.SETTINGS_VIEW
  ]
};

export const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  // Add more countries as needed
];

export const LEAVE_TYPES = [
  { id: 'annual', name: 'Annual Leave', color: '#4caf50' },
  { id: 'sick', name: 'Sick Leave', color: '#ff9800' },
  { id: 'maternity', name: 'Maternity Leave', color: '#e91e63' },
  { id: 'paternity', name: 'Paternity Leave', color: '#2196f3' },
  { id: 'emergency', name: 'Emergency Leave', color: '#f44336' },
  { id: 'unpaid', name: 'Unpaid Leave', color: '#9e9e9e' }
];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  WORK_FROM_HOME: 'work_from_home',
  ON_LEAVE: 'on_leave'
} as const;

export const CLAIM_TYPES = [
  { id: 'travel', name: 'Travel Expenses', icon: '✈️' },
  { id: 'meal', name: 'Meal Expenses', icon: '🍽️' },
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'medical', name: 'Medical Expenses', icon: '🏥' },
  { id: 'communication', name: 'Communication', icon: '📱' },
  { id: 'training', name: 'Training & Development', icon: '📚' },
  { id: 'other', name: 'Other Expenses', icon: '💼' }
];

export const ASSET_CATEGORIES = [
  'Computer Equipment',
  'Mobile Devices',
  'Office Furniture',
  'Vehicles',
  'Software Licenses',
  'Office Equipment',
  'Safety Equipment',
  'Tools & Machinery'
];

export const NOTIFICATION_TYPES = {
  LEAVE_REQUEST: 'leave_request',
  ATTENDANCE_ALERT: 'attendance_alert',
  PAYROLL_PROCESSED: 'payroll_processed',
  DOCUMENT_EXPIRY: 'document_expiry',
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  SYSTEM_ALERT: 'system_alert'
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  EMPLOYEE_ID_REGEX: /^[A-Z]{3}\d{3,6}$/
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    DOCUMENTS: ['pdf', 'doc', 'docx', 'txt'],
    IMAGES: ['jpg', 'jpeg', 'png', 'gif'],
    SPREADSHEETS: ['xls', 'xlsx', 'csv'],
    ALL: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'csv']
  }
};

export const INTEGRATION_CONFIGS = {
  WHATSAPP: {
    API_VERSION: 'v17.0',
    WEBHOOK_VERIFY_TOKEN: import.meta.env.VITE_REACT_APP_WHATSAPP_VERIFY_TOKEN
  },
  SENDGRID: {
    API_VERSION: 'v3',
    FROM_EMAIL: import.meta.env.VITE_REACT_APP_SENDGRID_FROM_EMAIL
  },
  AWS_S3: {
    REGION: import.meta.env.VITE_REACT_APP_AWS_REGION || 'us-east-1',
    BUCKET: import.meta.env.VITE_REACT_APP_AWS_S3_BUCKET
  }
};

export const AI_MODELS = {
  RESUME_PARSER: 'sentence-transformers/all-MiniLM-L6-v2',
  DOCUMENT_CLASSIFIER: 'facebook/bart-large-mnli',
  SENTIMENT_ANALYZER: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
  OCR_ENGINE: 'easyocr',
  ANOMALY_DETECTOR: 'isolation-forest',
  FORECASTING: 'prophet'
};