import { Request, Response, NextFunction } from 'express';
import { hasPermission } from '../utils/permissions';

/**
 * Middleware to check if user has required permissions
 * @param permissions Array of required permissions (any one is sufficient)
 */
export const authorize = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip authorization check if no permissions are required
    if (!permissions || permissions.length === 0) {
      return next();
    }
    
    // Check if user exists in request (set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }
    
    // Check if user has any of the required permissions
    const hasRequiredPermission = permissions.some(permission => 
      hasPermission(req.user.role, permission)
    );
    
    if (!hasRequiredPermission) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

/**
 * Middleware to check if user has all required permissions
 * @param permissions Array of required permissions (all are required)
 */
export const authorizeAll = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip authorization check if no permissions are required
    if (!permissions || permissions.length === 0) {
      return next();
    }
    
    // Check if user exists in request (set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }
    
    // Check if user has all required permissions
    const hasAllRequiredPermissions = permissions.every(permission => 
      hasPermission(req.user.role, permission)
    );
    
    if (!hasAllRequiredPermissions) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};