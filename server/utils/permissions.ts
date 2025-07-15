import { UserRole } from '../types';

// Define all possible permissions in the system
const PERMISSIONS = {
  // Dashboard
  DASHBOARD_GLOBAL: 'dashboard:global',
  DASHBOARD_HR: 'dashboard:hr',
  DASHBOARD_TEAM: 'dashboard:team',
  DASHBOARD_PERSONAL: 'dashboard:personal',
  
  // Employee Management
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ_ALL: 'employee:read_all',
  EMPLOYEE_READ_TEAM: 'employee:read_team',
  EMPLOYEE_READ_SELF: 'employee:read_self',
  EMPLOYEE_UPDATE_ALL: 'employee:update_all',
  EMPLOYEE_UPDATE_TEAM: 'employee:update_team',
  EMPLOYEE_UPDATE_SELF: 'employee:update_self',
  EMPLOYEE_DELETE: 'employee:delete',
  
  // Attendance
  ATTENDANCE_VIEW_ALL: 'attendance:view_all',
  ATTENDANCE_VIEW_TEAM: 'attendance:view_team',
  ATTENDANCE_VIEW_SELF: 'attendance:view_self',
  ATTENDANCE_APPROVE: 'attendance:approve',
  ATTENDANCE_MARK: 'attendance:mark',
  
  // Leave Management
  LEAVE_VIEW_ALL: 'leave:view_all',
  LEAVE_VIEW_TEAM: 'leave:view_team',
  LEAVE_VIEW_SELF: 'leave:view_self',
  LEAVE_APPROVE: 'leave:approve',
  LEAVE_APPLY: 'leave:apply',
  LEAVE_MANAGE_BALANCE: 'leave:manage_balance',
  
  // Timesheet
  TIMESHEET_VIEW_ALL: 'timesheet:view_all',
  TIMESHEET_VIEW_TEAM: 'timesheet:view_team',
  TIMESHEET_VIEW_SELF: 'timesheet:view_self',
  TIMESHEET_SUBMIT: 'timesheet:submit',
  TIMESHEET_APPROVE: 'timesheet:approve',
  
  // AI Features
  AI_FEATURES_ACCESS: 'ai:access',
  AI_RESUME_PARSER: 'ai:resume_parser',
  AI_ATTENDANCE_ANALYTICS: 'ai:attendance_analytics',
  AI_PAYROLL_PREDICTION: 'ai:payroll_prediction',
  AI_DOCUMENT_PROCESSOR: 'ai:document_processor',
  AI_CHATBOT: 'ai:chatbot',
  AI_PERFORMANCE_INSIGHTS: 'ai:performance_insights',
  AI_RECRUITMENT_ASSISTANT: 'ai:recruitment_assistant',
  
  // Payroll
  PAYROLL_PROCESS: 'payroll:process',
  PAYROLL_VIEW_ALL: 'payroll:view_all',
  PAYROLL_VIEW_TEAM: 'payroll:view_team',
  PAYROLL_VIEW_SELF: 'payroll:view_self',
  
  // Performance Management
  PERFORMANCE_CREATE: 'performance:create',
  PERFORMANCE_VIEW_ALL: 'performance:view_all',
  PERFORMANCE_VIEW_TEAM: 'performance:view_team',
  PERFORMANCE_VIEW_SELF: 'performance:view_self',
  PERFORMANCE_UPDATE_ALL: 'performance:update_all',
  PERFORMANCE_UPDATE_TEAM: 'performance:update_team',
  PERFORMANCE_UPDATE_SELF: 'performance:update_self',
  
  // Recruitment
  RECRUITMENT_MANAGE: 'recruitment:manage',
  RECRUITMENT_INTERVIEW: 'recruitment:interview',
  
  // Claims & Expenses
  CLAIMS_APPROVE: 'claims:approve',
  CLAIMS_VIEW_ALL: 'claims:view_all',
  CLAIMS_VIEW_TEAM: 'claims:view_team',
  CLAIMS_VIEW_SELF: 'claims:view_self',
  CLAIMS_SUBMIT: 'claims:submit',
  
  // Asset Management
  ASSET_MANAGE: 'asset:manage',
  ASSET_VIEW_ALL: 'asset:view_all',
  ASSET_VIEW_TEAM: 'asset:view_team',
  ASSET_VIEW_SELF: 'asset:view_self',
  
  // System Configuration
  SYSTEM_CONFIGURE: 'system:configure',
  SYSTEM_MANAGE_USERS: 'system:manage_users',
  SYSTEM_MANAGE_ROLES: 'system:manage_roles',
  
  // Reporting
  REPORTS_ALL: 'reports:all',
  REPORTS_HR: 'reports:hr',
  REPORTS_TEAM: 'reports:team',
  REPORTS_SELF: 'reports:self',
  
  // Notifications
  NOTIFICATIONS_BROADCAST: 'notifications:broadcast',
  NOTIFICATIONS_SEND: 'notifications:send',
  
  // Support Tickets
  SUPPORT_MANAGE_ALL: 'support:manage_all',
  SUPPORT_MANAGE_TEAM: 'support:manage_team',
  SUPPORT_CREATE: 'support:create',
  
  // Resignation
  RESIGNATION_APPROVE_FINAL: 'resignation:approve_final',
  RESIGNATION_APPROVE_FIRST: 'resignation:approve_first',
  RESIGNATION_INITIATE: 'resignation:initiate'
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  'super_admin': Object.values(PERMISSIONS), // Super Admin has all permissions
  
  'admin': [
    // Dashboard
    PERMISSIONS.DASHBOARD_GLOBAL,
    
    // Employee Management
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    PERMISSIONS.EMPLOYEE_UPDATE_ALL,
    PERMISSIONS.EMPLOYEE_DELETE,
    
    // Attendance
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    
    // Leave Management
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_MANAGE_BALANCE,
    
    // Timesheet
    PERMISSIONS.TIMESHEET_VIEW_ALL,
    PERMISSIONS.TIMESHEET_APPROVE,

    // AI Features
    PERMISSIONS.AI_FEATURES_ACCESS,
    PERMISSIONS.AI_RESUME_PARSER,
    PERMISSIONS.AI_ATTENDANCE_ANALYTICS,
    PERMISSIONS.AI_PAYROLL_PREDICTION,
    PERMISSIONS.AI_DOCUMENT_PROCESSOR,
    PERMISSIONS.AI_CHATBOT,
    PERMISSIONS.AI_PERFORMANCE_INSIGHTS,
    PERMISSIONS.AI_RECRUITMENT_ASSISTANT,
    
    // Payroll
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_VIEW_ALL,
    
    // Performance Management
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_UPDATE_ALL,
    
    // Recruitment
    PERMISSIONS.RECRUITMENT_MANAGE,
    PERMISSIONS.RECRUITMENT_INTERVIEW,
    
    // Claims & Expenses
    PERMISSIONS.CLAIMS_APPROVE,
    PERMISSIONS.CLAIMS_VIEW_ALL,
    
    // Asset Management
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.ASSET_VIEW_ALL,
    
    // System Configuration
    PERMISSIONS.SYSTEM_CONFIGURE,
    PERMISSIONS.SYSTEM_MANAGE_USERS,
    PERMISSIONS.SYSTEM_MANAGE_ROLES,
    
    // Reporting
    PERMISSIONS.REPORTS_ALL,
    
    // Notifications
    PERMISSIONS.NOTIFICATIONS_BROADCAST,
    PERMISSIONS.NOTIFICATIONS_SEND,
    
    // Support Tickets
    PERMISSIONS.SUPPORT_MANAGE_ALL,
    
    // Resignation
    PERMISSIONS.RESIGNATION_APPROVE_FINAL
  ],
  
  'hr': [
    // Dashboard
    PERMISSIONS.DASHBOARD_HR,
    
    // Employee Management
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    PERMISSIONS.EMPLOYEE_UPDATE_ALL,
    
    // Attendance
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    
    // Leave Management
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_MANAGE_BALANCE,
    
    // Timesheet
    PERMISSIONS.TIMESHEET_VIEW_ALL,
    PERMISSIONS.TIMESHEET_APPROVE,

    // AI Features
    PERMISSIONS.AI_FEATURES_ACCESS,
    PERMISSIONS.AI_RESUME_PARSER,
    PERMISSIONS.AI_ATTENDANCE_ANALYTICS,
    PERMISSIONS.AI_PAYROLL_PREDICTION,
    PERMISSIONS.AI_DOCUMENT_PROCESSOR,
    PERMISSIONS.AI_CHATBOT,
    PERMISSIONS.AI_PERFORMANCE_INSIGHTS,
    PERMISSIONS.AI_RECRUITMENT_ASSISTANT,
    
    // Payroll
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_VIEW_ALL,
    
    // Performance Management
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_UPDATE_ALL,
    
    // Recruitment
    PERMISSIONS.RECRUITMENT_MANAGE,
    PERMISSIONS.RECRUITMENT_INTERVIEW,
    
    // Claims & Expenses
    PERMISSIONS.CLAIMS_VIEW_ALL,
    PERMISSIONS.CLAIMS_APPROVE,
    
    // Asset Management
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.ASSET_VIEW_ALL,
    
    // System Configuration
    PERMISSIONS.SYSTEM_MANAGE_USERS,
    
    // Reporting
    PERMISSIONS.REPORTS_HR,
    
    // Notifications
    PERMISSIONS.NOTIFICATIONS_SEND,
    
    // Support Tickets
    PERMISSIONS.SUPPORT_MANAGE_ALL,
    
    // Resignation
    PERMISSIONS.RESIGNATION_APPROVE_FINAL
  ],
  
  'manager': [
    // Dashboard
    PERMISSIONS.DASHBOARD_TEAM,
    
    // Employee Management
    PERMISSIONS.EMPLOYEE_READ_TEAM,
    
    // Attendance
    PERMISSIONS.ATTENDANCE_VIEW_TEAM,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.ATTENDANCE_MARK,
    
    // Leave Management
    PERMISSIONS.LEAVE_VIEW_TEAM,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_SELF,
    PERMISSIONS.LEAVE_APPLY,

    // Timesheet
    PERMISSIONS.TIMESHEET_VIEW_TEAM,
    PERMISSIONS.TIMESHEET_VIEW_SELF,
    PERMISSIONS.TIMESHEET_SUBMIT,
    PERMISSIONS.TIMESHEET_APPROVE,

    // AI Features
    PERMISSIONS.AI_FEATURES_ACCESS,
    PERMISSIONS.AI_ATTENDANCE_ANALYTICS,
    PERMISSIONS.AI_CHATBOT,
    PERMISSIONS.AI_PERFORMANCE_INSIGHTS,
    
    // Payroll
    PERMISSIONS.PAYROLL_VIEW_TEAM,
    PERMISSIONS.PAYROLL_VIEW_SELF,
    
    // Performance Management
    PERMISSIONS.PERFORMANCE_VIEW_TEAM,
    PERMISSIONS.PERFORMANCE_UPDATE_TEAM,
    PERMISSIONS.PERFORMANCE_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_UPDATE_SELF,
    
    // Recruitment
    PERMISSIONS.RECRUITMENT_INTERVIEW,
    
    // Claims & Expenses
    PERMISSIONS.CLAIMS_VIEW_TEAM,
    PERMISSIONS.CLAIMS_APPROVE,
    PERMISSIONS.CLAIMS_VIEW_SELF,
    PERMISSIONS.CLAIMS_SUBMIT,
    
    // Asset Management
    PERMISSIONS.ASSET_VIEW_TEAM,
    PERMISSIONS.ASSET_VIEW_SELF,
    
    // Reporting
    PERMISSIONS.REPORTS_TEAM,
    PERMISSIONS.REPORTS_SELF,
    
    // Support Tickets
    PERMISSIONS.SUPPORT_MANAGE_TEAM,
    PERMISSIONS.SUPPORT_CREATE,
    
    // Resignation
    PERMISSIONS.RESIGNATION_APPROVE_FIRST,
    PERMISSIONS.RESIGNATION_INITIATE
  ],
  
  'employee': [
    // Dashboard
    PERMISSIONS.DASHBOARD_PERSONAL,
    
    // Employee Management
    PERMISSIONS.EMPLOYEE_READ_SELF,
    PERMISSIONS.EMPLOYEE_UPDATE_SELF,
    
    // Attendance
    PERMISSIONS.ATTENDANCE_VIEW_SELF,
    PERMISSIONS.ATTENDANCE_MARK,
    
    // Leave Management
    PERMISSIONS.LEAVE_VIEW_SELF,
    PERMISSIONS.LEAVE_APPLY,

    // Timesheet
    PERMISSIONS.TIMESHEET_VIEW_SELF,
    PERMISSIONS.TIMESHEET_SUBMIT,

    // AI Features
    PERMISSIONS.AI_FEATURES_ACCESS,
    PERMISSIONS.AI_CHATBOT,
    
    // Payroll
    PERMISSIONS.PAYROLL_VIEW_SELF,
    
    // Performance Management
    PERMISSIONS.PERFORMANCE_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_UPDATE_SELF,
    
    // Claims & Expenses
    PERMISSIONS.CLAIMS_VIEW_SELF,
    PERMISSIONS.CLAIMS_SUBMIT,
    
    // Asset Management
    PERMISSIONS.ASSET_VIEW_SELF,
    
    // Reporting
    PERMISSIONS.REPORTS_SELF,
    
    // Support Tickets
    PERMISSIONS.SUPPORT_CREATE,
    
    // Resignation
    PERMISSIONS.RESIGNATION_INITIATE
  ]
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole The role of the user
 * @param {string} permission The permission to check
 * @returns {boolean} indicating if the user has the permission
 */
const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;
  
  // Check if the user's role has the specific permission
  return ROLE_PERMISSIONS[userRole].includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} userRole The role of the user
 * @param {string[]} permissions Array of permissions to check
 * @returns {boolean} indicating if the user has any of the permissions
 */
const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions.length) return false;
  
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;
  
  // Check if the user's role has any of the specified permissions
  return permissions.some(permission => ROLE_PERMISSIONS[userRole].includes(permission));
};

/**
 * Get all permissions for a specific role
 * @param {string} userRole The role to get permissions for
 * @returns {string[]} Array of permission strings
 */
const getRolePermissions = (userRole) => {
  if (!userRole) return [];
  return ROLE_PERMISSIONS[userRole] || [];
};

export {
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  getRolePermissions
};
