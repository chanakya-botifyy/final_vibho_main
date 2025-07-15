import { Request, Response } from 'express';
import Employee, { EmployeeStatus } from '../models/employee.model';
import { User, UserRole } from '../models/user.model';
import mongoose from 'mongoose';

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;
    const { department, status, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { tenantId };

    if (department) {
      query['companyInfo.department'] = department;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const employees = await Employee.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ 'personalInfo.firstName': 1 });

    // Get total count
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      employees,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId, role, id: userId } = req.user;

    // Check if user has permission to view this employee
    if (role === UserRole.EMPLOYEE && userId !== id) {
      return res.status(403).json({ message: 'Unauthorized to view this employee' });
    }

    const employee = await Employee.findOne({ _id: id, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Create new employee
export const createEmployee = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tenantId } = req.user;
    const { personalInfo, companyInfo, bankInfo, employeeId, status, user } = req.body;

    // Create user account if provided
    let userId;
    if (user) {
      const { email, password, name, role } = user;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const newUser = new User({
        email,
        password,
        name: name || `${personalInfo.firstName} ${personalInfo.lastName}`,
        role: role || UserRole.EMPLOYEE,
        department: companyInfo.department,
        designation: companyInfo.designation,
        employeeId,
        tenantId
      });

      await newUser.save({ session });
      userId = newUser._id;
    }

    // Create employee
    const employee = new Employee({
      employeeId,
      userId,
      personalInfo,
      companyInfo,
      bankInfo,
      status: status || EmployeeStatus.ACTIVE,
      tenantId
    });

    await employee.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const updates = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ _id: id, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Restrict certain fields based on role
    if (role === UserRole.EMPLOYEE || role === UserRole.MANAGER) {
      // Only allow updating personal info for non-admin users
      const allowedUpdates = ['personalInfo'];
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Update user if employee has a user account
    if (employee.userId && (updates.personalInfo || updates.companyInfo)) {
      const userUpdates: any = {};
      
      if (updates.personalInfo) {
        userUpdates.name = `${updates.personalInfo.firstName} ${updates.personalInfo.lastName}`;
      }
      
      if (updates.companyInfo) {
        userUpdates.department = updates.companyInfo.department;
        userUpdates.designation = updates.companyInfo.designation;
      }

      await User.findByIdAndUpdate(employee.userId, userUpdates);
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { tenantId } = req.user;

    // Check if employee exists
    const employee = await Employee.findOne({ _id: id, tenantId });
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete employee
    await Employee.findByIdAndDelete(id, { session });

    // Delete associated user if exists
    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Get employee documents
export const getEmployeeDocuments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId, role, id: userId } = req.user;

    // Check if user has permission to view this employee's documents
    if (role === UserRole.EMPLOYEE && userId !== id) {
      return res.status(403).json({ message: 'Unauthorized to view these documents' });
    }

    const employee = await Employee.findOne({ _id: id, tenantId }).select('documents');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee.documents);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Add employee document
export const addEmployeeDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.user;
    const { name, type, url, expiryDate } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ _id: id, tenantId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Add document
    const document = {
      name,
      type,
      url,
      uploadedAt: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      verified: false
    };

    employee.documents.push(document);
    await employee.save();

    res.status(201).json({
      message: 'Document added successfully',
      document
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

// Get employee statistics
export const getEmployeeStats = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user;

    const stats = {
      total: await Employee.countDocuments({ tenantId }),
      active: await Employee.countDocuments({ tenantId, status: EmployeeStatus.ACTIVE }),
      inactive: await Employee.countDocuments({ tenantId, status: EmployeeStatus.INACTIVE }),
      onLeave: await Employee.countDocuments({ tenantId, status: EmployeeStatus.ON_LEAVE }),
      departments: await Employee.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$companyInfo.department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    };

    res.status(200).json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
