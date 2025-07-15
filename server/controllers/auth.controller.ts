import { Request, Response } from 'express';
import { User, UserRole } from '../models/user.model';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee.model';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, tenantId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    role: role || UserRole.EMPLOYEE,
      tenantId: tenantId || 'default'
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Verify password
    // @ts-ignore
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Get employee details if exists
    let employee = null;
    if (user.role === UserRole.EMPLOYEE || user.role === UserRole.MANAGER) {
      employee = await Employee.findOne({ userId: user._id }).select('-bankInfo');
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId,
        tenantId: user.tenantId,
        lastLogin: user.lastLogin
      },
      employee
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get employee details if exists
    let employee = null;
    if (user.role === UserRole.EMPLOYEE || user.role === UserRole.MANAGER) {
      employee = await Employee.findOne({ userId: user._id }).select('-bankInfo');
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId,
        tenantId: user.tenantId,
        lastLogin: user.lastLogin
      },
      employee
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    );

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    const token = user.generateAuthToken();

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    // @ts-ignore
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET || 'your-reset-secret',
      { expiresIn: '1h' }
    );

    // TODO: Send reset email with token

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify reset token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET || 'your-reset-secret'
    );

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  // In a stateless JWT auth system, the client is responsible for removing the token
  res.status(200).json({ message: 'Logged out successfully' });
};
