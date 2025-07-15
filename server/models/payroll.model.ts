import mongoose, { Document, Schema, Model } from 'mongoose';

export enum PayrollStatus {
  DRAFT = 'draft',
  PROCESSED = 'processed',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export interface IPayrollComponent {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction';
  taxable: boolean;
}

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  allowances: IPayrollComponent[];
  deductions: IPayrollComponent[];
  grossSalary: number;
  netSalary: number;
  tax: number;
  currency: string;
  country: string;
  paymentDate?: Date;
  payslipUrl?: string;
  status: PayrollStatus;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const payrollComponentSchema = new Schema<IPayrollComponent>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['allowance', 'deduction'], required: true },
  taxable: { type: Boolean, default: false }
});

const payrollSchema = new Schema<IPayroll>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: [payrollComponentSchema],
    deductions: [payrollComponentSchema],
    grossSalary: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    tax: { type: Number, required: true },
    currency: { type: String, required: true },
    country: { type: String, required: true },
    paymentDate: { type: Date },
    payslipUrl: { type: String },
    status: { type: String, enum: Object.values(PayrollStatus), default: PayrollStatus.DRAFT },
    tenantId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Create compound index for faster queries
payrollSchema.index({ employeeId: 1, month: 1, year: 1, tenantId: 1 }, { unique: true });
payrollSchema.index({ status: 1 });
payrollSchema.index({ month: 1, year: 1 });

const Payroll: Model<IPayroll> = mongoose.model<IPayroll>('Payroll', payrollSchema);

export { Payroll };
