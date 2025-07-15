import React from 'react';
import { UserRole } from '../../types';
import { hasPermission, hasAnyPermission } from '../../utils/permissions';
import { useAuthStore } from '../../store/useAuthStore';

interface PermissionGuardProps {
  /**
   * The permission(s) required to render the children
   * Can be a single permission string or an array of permissions
   */
  permission: string | string[];
  
  /**
   * If true, the user must have ALL permissions in the array
   * If false (default), the user must have ANY permission in the array
   */
  requireAll?: boolean;
  
  /**
   * Content to render when the user has the required permission(s)
   */
  children: React.ReactNode;
  
  /**
   * Optional content to render when the user doesn't have the required permission(s)
   * If not provided, nothing will be rendered
   */
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  requireAll = false,
  children,
  fallback = null
}) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }
  
  const userRole = user.role;
  
  // Check if the user has the required permission(s)
  const hasRequiredPermission = Array.isArray(permission)
    ? requireAll
      ? permission.every(p => hasPermission(userRole, p))
      : hasAnyPermission(userRole, permission)
    : hasPermission(userRole, permission);
  
  // Render children if the user has the required permission(s), otherwise render fallback
  return hasRequiredPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;