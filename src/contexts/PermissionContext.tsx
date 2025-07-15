import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { hasPermission } from '../utils/permissions';

interface PermissionContextType {
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user } = useAuthStore();

  const can = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const canAny = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(user.role, permission));
  };

  const canAll = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(user.role, permission));
  };

  const value: PermissionContextType = {
    can,
    canAny,
    canAll
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};