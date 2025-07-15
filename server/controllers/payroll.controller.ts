import { Request, Response } from 'express';
import { Payroll, PayrollStatus } from '../models/payroll.model';
import Employee, { IEmployee } from '../models/employee.model';
import { UserRole } from '../models/user.model';
import mongoose from 'mongoose';

// Generate payroll
export const generatePayroll = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role } = user;
    const { employeeId, month, year } = req.body;

    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to generate payroll' });
    }

    const employee = await Employee.findOne({ _id: employeeId, tenantId }).populate('userId', 'name');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const existingPayroll = await Payroll.findOne({ employeeId, month, year, tenantId });
    if (existingPayroll) return res.status(400).json({ message: 'Payroll already exists for this month' });

    const basicSalary = 75000;
    const allowances = [
      { name: 'House Rent Allowance', amount: 30000, type: 'allowance' as const, taxable: true },
      { name: 'Transport Allowance', amount: 5000, type: 'allowance' as const, taxable: false },
      { name: 'Medical Allowance', amount: 2500, type: 'allowance' as const, taxable: false }
    ];
    const deductions = [
      { name: 'Provident Fund', amount: 9000, type: 'deduction' as const, taxable: false },
      { name: 'Professional Tax', amount: 200, type: 'deduction' as const, taxable: false }
    ];

    const grossSalary = basicSalary + allowances.reduce((sum, a) => sum + a.amount, 0);
    const taxableIncome = basicSalary + allowances.filter(a => a.taxable).reduce((sum, a) => sum + a.amount, 0);
    const tax = Math.round(taxableIncome * 0.11);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0) + tax;
    const netSalary = grossSalary - totalDeductions;

    const payroll = new Payroll({
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      grossSalary,
      netSalary,
      tax,
      currency: 'INR',
      country: 'India',
      status: PayrollStatus.DRAFT,
      tenantId
    });

    await payroll.save();

    res.status(201).json({ message: 'Payroll generated successfully', payroll });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Process payroll
export const processPayroll = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role } = user;
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid payroll ID' });
    }

    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to process payroll' });
    }

    const payroll = await Payroll.findOne({ _id: id, tenantId, status: PayrollStatus.DRAFT });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found or already processed' });

    payroll.status = PayrollStatus.PROCESSED;
    await payroll.save();

    res.status(200).json({ message: 'Payroll processed successfully', payroll });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Mark payroll as paid
export const markAsPaid = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role } = user;
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid payroll ID' });
    }
    const { paymentDate = new Date() } = req.body;

    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to mark payroll as paid' });
    }

    const payroll = await Payroll.findOne({ _id: id, tenantId, status: PayrollStatus.PROCESSED });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found or not processed' });

    payroll.status = PayrollStatus.PAID;
    payroll.paymentDate = new Date(paymentDate);
    await payroll.save();

    res.status(200).json({ message: 'Payroll marked as paid successfully', payroll });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Get payroll records
export const getPayrollRecords = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role, id: userId } = user;
    const { employeeId, month, year, status, page = 1, limit = 10 } = req.query;

    const query: any = { tenantId };

    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      query.employeeId = employee._id;
    }

    if (month) query.month = Number(month);
    if (year) query.year = Number(year);
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const payrollRecords = await Payroll.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ year: -1, month: -1 })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId');

    const total = await Payroll.countDocuments(query);

    res.status(200).json({
      records: payrollRecords,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Get payroll by ID
export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role, id: userId } = user;
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid payroll ID' });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid payroll ID' });
    }

    const payroll = await Payroll.findOne({ _id: id, tenantId })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId');

    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    if (role === UserRole.EMPLOYEE) {
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee || !(payroll.employeeId == employee._id)) {
        return res.status(403).json({ message: 'Unauthorized to view this payroll' });
      }
    }

    res.status(200).json(payroll);
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Generate bulk payroll
export const generateBulkPayroll = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role } = user;
    const { month, year, department } = req.body;

    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to generate bulk payroll' });
    }

    const query: any = { tenantId, status: 'active' };
    if (department) query['companyInfo.department'] = department;

    const employees: IEmployee[] = await Employee.find(query);
    if (employees.length === 0) return res.status(404).json({ message: 'No employees found' });

    const existingPayrolls = await Payroll.find({
      employeeId: { $in: employees.map(emp => emp._id as mongoose.Types.ObjectId) },
      month,
      year,
      tenantId
    });

    const existingEmployeeIds = existingPayrolls.map(p => p.employeeId.toString());
    const employeesToProcess = employees.filter(emp => !existingEmployeeIds.includes((emp._id as mongoose.Types.ObjectId).toString()));

    if (employeesToProcess.length === 0) {
      return res.status(400).json({ message: 'Payroll already generated for all employees in this period' });
    }

    const payrolls = [];

    for (const employee of employeesToProcess) {
      const basicSalary = 75000;
      const allowances = [
        { name: 'House Rent Allowance', amount: 30000, type: 'allowance' as const, taxable: true },
        { name: 'Transport Allowance', amount: 5000, type: 'allowance' as const, taxable: false },
        { name: 'Medical Allowance', amount: 2500, type: 'allowance' as const, taxable: false }
      ];
      const deductions = [
        { name: 'Provident Fund', amount: 9000, type: 'deduction' as const, taxable: false },
        { name: 'Professional Tax', amount: 200, type: 'deduction' as const, taxable: false }
      ];

      const grossSalary = basicSalary + allowances.reduce((sum, a) => sum + a.amount, 0);
      const taxableIncome = basicSalary + allowances.filter(a => a.taxable).reduce((sum, a) => sum + a.amount, 0);
      const tax = Math.round(taxableIncome * 0.11);
      const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0) + tax;
      const netSalary = grossSalary - totalDeductions;

      const payroll = new Payroll({
        employeeId: employee._id as mongoose.Types.ObjectId,
        month,
        year,
        basicSalary,
        allowances,
        deductions,
        grossSalary,
        netSalary,
        tax,
        currency: 'INR',
        country: 'India',
        status: PayrollStatus.DRAFT,
        tenantId
      });

      await payroll.save();
      payrolls.push(payroll);
    }

    res.status(201).json({ message: `Payroll generated for ${payrolls.length} employees`, payrolls });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// Get payroll statistics
export const getPayrollStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { tenantId, role } = user;
    const { month, year } = req.query;

    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to view payroll statistics' });
    }

    const query: any = { tenantId };
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);

    const payrollRecords = await Payroll.find(query);

    const stats = {
      totalEmployees: await Employee.countDocuments({ tenantId, status: 'active' }),
      processedEmployees: payrollRecords.length,
      totalGrossPay: payrollRecords.reduce((sum, p) => sum + p.grossSalary, 0),
      totalNetPay: payrollRecords.reduce((sum, p) => sum + p.netSalary, 0),
      totalTax: payrollRecords.reduce((sum, p) => sum + p.tax, 0),
      totalDeductions: payrollRecords.reduce((sum, p) => sum + p.deductions.reduce((s, d) => s + d.amount, 0), 0),
      averageSalary: payrollRecords.length > 0
        ? payrollRecords.reduce((sum, p) => sum + p.netSalary, 0) / payrollRecords.length
        : 0,
      statusCounts: {
        draft: payrollRecords.filter(p => p.status === PayrollStatus.DRAFT).length,
        processed: payrollRecords.filter(p => p.status === PayrollStatus.PROCESSED).length,
        paid: payrollRecords.filter(p => p.status === PayrollStatus.PAID).length
      }
    };

    res.status(200).json(stats);
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};
