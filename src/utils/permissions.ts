// Permissions utility for VibhoHCM
// This file contains permission definitions and helper functions

import { UserRole } from '../types';

// Permission constants
export const PERMISSIONS = {
  // Super Admin permissions
  SUPER_ADMIN_ACCESS: 'super_admin:access',
  TENANT_MANAGE: 'tenant:manage',
  SUBSCRIPTION_MANAGE: 'subscription:manage',
  
  // Dashboard permissions
  DASHBOARD_GLOBAL: 'dashboard:global',
  DASHBOARD_HR: 'dashboard:hr',
  DASHBOARD_TEAM: 'dashboard:team',
  DASHBOARD_PERSONAL: 'dashboard:personal',
  WORKFLOW_VIEW: 'workflow:view',
  
  // Employee permissions
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ_ALL: 'employee:read:all',
  EMPLOYEE_READ_TEAM: 'employee:read:team',
  EMPLOYEE_READ_SELF: 'employee:read:self',
  EMPLOYEE_UPDATE_ALL: 'employee:update:all',
  EMPLOYEE_UPDATE_TEAM: 'employee:update:team',
  EMPLOYEE_UPDATE_SELF: 'employee:update:self',
  EMPLOYEE_DELETE: 'employee:delete',
  
  // Attendance permissions
  ATTENDANCE_VIEW_ALL: 'attendance:view:all',
  ATTENDANCE_VIEW_TEAM: 'attendance:view:team',
  ATTENDANCE_VIEW_SELF: 'attendance:view:self',
  ATTENDANCE_APPROVE: 'attendance:approve',
  
  // Leave permissions
  LEAVE_VIEW_ALL: 'leave:view:all',
  LEAVE_VIEW_TEAM: 'leave:view:team',
  LEAVE_VIEW_SELF: 'leave:view:self',
  LEAVE_APPLY: 'leave:apply',
  LEAVE_APPROVE: 'leave:approve',
  
  // Payroll permissions
  PAYROLL_PROCESS: 'payroll:process',
  PAYROLL_VIEW_ALL: 'payroll:view:all',
  PAYROLL_VIEW_SELF: 'payroll:view:self',
  
  // Performance permissions
  PERFORMANCE_VIEW_ALL: 'performance:view:all',
  PERFORMANCE_VIEW_TEAM: 'performance:view:team',
  PERFORMANCE_VIEW_SELF: 'performance:view:self',
  PERFORMANCE_CREATE: 'performance:create',
  PERFORMANCE_UPDATE_ALL: 'performance:update:all',
  PERFORMANCE_UPDATE_TEAM: 'performance:update:team',
  PERFORMANCE_UPDATE_SELF: 'performance:update:self',
  
  // Recruitment permissions
  RECRUITMENT_MANAGE: 'recruitment:manage',
  RECRUITMENT_VIEW: 'recruitment:view',
  
  // Asset permissions
  ASSET_MANAGE: 'asset:manage',
  ASSET_VIEW_ALL: 'asset:view:all',
  ASSET_VIEW_TEAM: 'asset:view:team',
  ASSET_VIEW_SELF: 'asset:view:self',
  
  // Claims permissions
  CLAIMS_APPROVE: 'claims:approve',
  CLAIMS_VIEW_ALL: 'claims:view:all',
  CLAIMS_VIEW_TEAM: 'claims:view:team',
  CLAIMS_VIEW_SELF: 'claims:view:self',
  CLAIMS_SUBMIT: 'claims:submit',
  
  // Reports permissions
  REPORTS_ALL: 'reports:all',
  REPORTS_HR: 'reports:hr',
  REPORTS_TEAM: 'reports:team',
  REPORTS_SELF: 'reports:self',
  
  // System permissions
  SYSTEM_CONFIGURE: 'system:configure',
  SYSTEM_MANAGE_USERS: 'system:manage:users',
  SYSTEM_MANAGE_ROLES: 'system:manage:roles',
  
  // Support permissions
  SUPPORT_MANAGE_ALL: 'support:manage:all',
  SUPPORT_MANAGE_TEAM: 'support:manage:team',
  SUPPORT_CREATE: 'support:create',
  
  // Timesheet permissions
  TIMESHEET_VIEW_ALL: 'timesheet:view:all',
  TIMESHEET_VIEW_TEAM: 'timesheet:view:team',
  TIMESHEET_VIEW_SELF: 'timesheet:view:self',
  TIMESHEET_SUBMIT: 'timesheet:submit',
  TIMESHEET_APPROVE: 'timesheet:approve'
};

// Role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['*'], // Super admin has all permissions
  
  
  
  [UserRole.ADMIN]: [
    PERMISSIONS.DASHBOARD_GLOBAL,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    PERMISSIONS.EMPLOYEE_UPDATE_ALL,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_UPDATE_ALL,
    PERMISSIONS.RECRUITMENT_MANAGE,
    PERMISSIONS.RECRUITMENT_VIEW,
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.ASSET_VIEW_ALL,
    PERMISSIONS.CLAIMS_APPROVE,
    PERMISSIONS.CLAIMS_VIEW_ALL,
    PERMISSIONS.REPORTS_ALL,
    PERMISSIONS.SYSTEM_CONFIGURE,
    PERMISSIONS.SYSTEM_MANAGE_USERS,
    PERMISSIONS.SYSTEM_MANAGE_ROLES,
    PERMISSIONS.SUPPORT_MANAGE_ALL,
    PERMISSIONS.TIMESHEET_VIEW_ALL,
    PERMISSIONS.TIMESHEET_APPROVE
  ],
  
  [UserRole.HR]: [
    PERMISSIONS.DASHBOARD_HR,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    PERMISSIONS.EMPLOYEE_UPDATE_ALL,
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_ALL,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_VIEW_ALL,
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_UPDATE_ALL,
    PERMISSIONS.RECRUITMENT_MANAGE,
    PERMISSIONS.RECRUITMENT_VIEW,
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.ASSET_VIEW_ALL,
    PERMISSIONS.CLAIMS_APPROVE,
    PERMISSIONS.CLAIMS_VIEW_ALL,
    PERMISSIONS.REPORTS_HR,
    PERMISSIONS.SUPPORT_MANAGE_ALL,
    PERMISSIONS.TIMESHEET_VIEW_ALL,
    PERMISSIONS.TIMESHEET_APPROVE
  ],
  
  [UserRole.MANAGER]: [
    PERMISSIONS.DASHBOARD_TEAM,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EMPLOYEE_READ_TEAM,
    PERMISSIONS.EMPLOYEE_UPDATE_TEAM,
    PERMISSIONS.ATTENDANCE_VIEW_TEAM,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_TEAM,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_VIEW_SELF,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.PAYROLL_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_VIEW_TEAM,
    PERMISSIONS.PERFORMANCE_UPDATE_TEAM,
    PERMISSIONS.PERFORMANCE_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_UPDATE_SELF,
    PERMISSIONS.ASSET_VIEW_TEAM,
    PERMISSIONS.ASSET_VIEW_SELF,
    PERMISSIONS.CLAIMS_VIEW_TEAM,
    PERMISSIONS.CLAIMS_APPROVE,
    PERMISSIONS.CLAIMS_VIEW_SELF,
    PERMISSIONS.CLAIMS_SUBMIT,
    PERMISSIONS.REPORTS_TEAM,
    PERMISSIONS.SUPPORT_MANAGE_TEAM,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.TIMESHEET_VIEW_TEAM,
    PERMISSIONS.TIMESHEET_APPROVE,
    PERMISSIONS.TIMESHEET_VIEW_SELF,
    PERMISSIONS.TIMESHEET_SUBMIT
  ],
  
  [UserRole.EMPLOYEE]: [
    PERMISSIONS.DASHBOARD_PERSONAL,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EMPLOYEE_READ_SELF,
    PERMISSIONS.EMPLOYEE_UPDATE_SELF,
    PERMISSIONS.ATTENDANCE_VIEW_SELF,
    PERMISSIONS.LEAVE_VIEW_SELF,
    PERMISSIONS.LEAVE_APPLY,
    PERMISSIONS.PAYROLL_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_VIEW_SELF,
    PERMISSIONS.PERFORMANCE_UPDATE_SELF,
    PERMISSIONS.ASSET_VIEW_SELF,
    PERMISSIONS.CLAIMS_VIEW_SELF,
    PERMISSIONS.CLAIMS_SUBMIT,
    PERMISSIONS.REPORTS_SELF,
    PERMISSIONS.SUPPORT_CREATE,
    PERMISSIONS.TIMESHEET_VIEW_SELF,
    PERMISSIONS.TIMESHEET_SUBMIT
  ]
};

/**
 * Check if a role has a specific permission
 * @param role User role
 * @param permission Permission to check
 * @returns Boolean indicating if the role has the permission
 */
export const hasPermission = (role: UserRole | string, permission: string): boolean => {
  // Convert string role to enum if needed
  const userRole = typeof role === 'string' ? role as UserRole : role;
  
  // Get permissions for the role
  const permissions = ROLE_PERMISSIONS[userRole];
  
  // Check if role has wildcard permission
  if (permissions.includes('*')) {
    return true;
  }
  
  // Check for specific permission
  return permissions.includes(permission);
};

/**
 * Get all permissions for a role
 * @param role User role
 * @returns Array of permissions
 */
export const getRolePermissions = (role: UserRole | string): string[] => {
  // Convert string role to enum if needed
  const userRole = typeof role === 'string' ? role as UserRole : role;
  
  // Return permissions for the role
  return ROLE_PERMISSIONS[userRole];
};

/**
 * Check if a role has any of the specified permissions
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns Boolean indicating if the role has any of the permissions
 */
export const hasAnyPermission = (role: UserRole | string, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns Boolean indicating if the role has all of the permissions
 */
export const hasAllPermissions = (role: UserRole | string, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

export default {
  PERMISSIONS,
  hasPermission,
  getRolePermissions,
  hasAnyPermission,
  hasAllPermissions
};