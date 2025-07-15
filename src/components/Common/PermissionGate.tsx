import React from 'react';
import { usePermission } from '../../contexts/PermissionContext';

interface PermissionGateProps {
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
const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  requireAll = false,
  children,
  fallback = null
}) => {
  const { can, canAny, canAll } = usePermission();
  
  // Check if the user has the required permission(s)
  const hasRequiredPermission = Array.isArray(permission)
    ? requireAll
      ? canAll(permission)
      : canAny(permission)
    : can(permission);
  
  // Render children if the user has the required permission(s), otherwise render fallback
  return hasRequiredPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;

export { PermissionGate };