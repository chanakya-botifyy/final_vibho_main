// Permission hook for VibhoHCM
// This hook provides access to permission checking functionality

import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissions';

export const usePermission = () => {
  const { user } = useAuthStore();
  
  // Check if user has a specific permission
  const can = useCallback((permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);
  
  // Check if user has any of the specified permissions
  const canAny = useCallback((permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(user.role, permission));
  }, [user]);
  
  // Check if user has all of the specified permissions
  const canAll = useCallback((permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(user.role, permission));
  }, [user]);
  
  return { can, canAny, canAll };
};

export default usePermission;