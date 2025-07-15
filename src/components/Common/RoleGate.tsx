import React from 'react';
import { UserRole } from '../../types';
import { usePermission } from '../../contexts/PermissionContext';

interface RoleGateProps {
  /**
   * The role(s) required to render the children
   * Can be a single role or an array of roles
   */
  roles: UserRole | UserRole[];
  
  /**
   * Content to render when the user has the required role(s)
   */
  children: React.ReactNode;
  
  /**
   * Optional content to render when the user doesn't have the required role(s)
   * If not provided, nothing will be rendered
   */
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders its children based on user roles
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  roles,
  children,
  fallback = null
}) => {
  const { hasRole, hasAnyRole } = usePermission();
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  // Check if the user's role is in the allowed roles
  const hasRequiredRole = allowedRoles.length === 1
    ? hasRole(allowedRoles[0])
    : hasAnyRole(allowedRoles);
  
  // Render children if the user has the required role(s), otherwise render fallback
  return hasRequiredRole ? <>{children}</> : <>{fallback}</>;
};

export default RoleGate;