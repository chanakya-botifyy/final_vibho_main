import mongoose, { Document, Schema, Model } from 'mongoose';

export enum CountryPayrollStatus {
  DRAFT = 'draft',
  PROCESSED = 'processed',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export interface ITaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface IStandardDeduction {
  name: string;
  amount?: number;
  percentage?: number;
  maxLimit?: number;
}

export interface IStatutoryContribution {
  name: string;
  employeeRate: number;
  employerRate: number;
  maxContributionBase?: number;
}

export interface ITaxRule extends Document {
  country: string;
  taxBrackets: ITaxBracket[];
  standardDeductions: IStandardDeduction[];
  statutoryContributions: IStatutoryContribution[];
}

const taxBracketSchema = new Schema<ITaxBracket>({
  min: { type: Number, required: true },
  max: { type: Number },
  rate: { type: Number, required: true }
});

const standardDeductionSchema = new Schema<IStandardDeduction>({
  name: { type: String, required: true },
  amount: { type: Number },
  percentage: { type: Number },
  maxLimit: { type: Number }
});

const statutoryContributionSchema = new Schema<IStatutoryContribution>({
  name: { type: String, required: true },
  employeeRate: { type: Number, required: true },
  employerRate: { type: Number, required: true },
  maxContributionBase: { type: Number }
});

const taxRuleSchema = new Schema<ITaxRule>({
  country: { type: String, required: true },
  taxBrackets: [taxBracketSchema],
  standardDeductions: [standardDeductionSchema],
  statutoryContributions: [statutoryContributionSchema]
});

export interface ICountryPayrollComponent {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction' | 'statutory';
  taxable: boolean;
  countrySpecific: boolean;
  statutoryCode?: string;
}

const countryPayrollComponentSchema = new Schema<ICountryPayrollComponent>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['allowance', 'deduction', 'statutory'], required: true },
  taxable: { type: Boolean, default: false },
  countrySpecific: { type: Boolean, default: true },
  statutoryCode: { type: String }
});

export interface IMultiCountryPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  country: string;
  currency: string;
  exchangeRate: number;
  basicSalary: number;
  allowances: ICountryPayrollComponent[];
  deductions: ICountryPayrollComponent[];
  statutoryDeductions: ICountryPayrollComponent[];
  grossSalary: number;
  taxableIncome: number;
  tax: number;
  netSalary: number;
  employerContributions: ICountryPayrollComponent[];
  totalEmployerCost: number;
  paymentDate?: Date;
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'digital_wallet';
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    swiftCode?: string;
    routingNumber?: string;
  };
  payslipUrl?: string;
  status: CountryPayrollStatus;
  complianceChecks: {
    name?: string;
    status?: 'passed' | 'failed' | 'warning';
    message?: string;
  }[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const multiCountryPayrollSchema = new Schema<IMultiCountryPayroll>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
    exchangeRate: { type: Number, default: 1 },
    basicSalary: { type: Number, required: true },
    allowances: [countryPayrollComponentSchema],
    deductions: [countryPayrollComponentSchema],
    statutoryDeductions: [countryPayrollComponentSchema],
    grossSalary: { type: Number, required: true },
    taxableIncome: { type: Number, required: true },
    tax: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    employerContributions: [countryPayrollComponentSchema],
    totalEmployerCost: { type: Number, required: true },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['bank_transfer', 'check', 'cash', 'digital_wallet'], default: 'bank_transfer' },
    bankDetails: {
      bankName: { type: String },
      accountNumber: { type: String },
      swiftCode: { type: String },
      routingNumber: { type: String }
    },
    payslipUrl: { type: String },
    status: { type: String, enum: Object.values(CountryPayrollStatus), default: CountryPayrollStatus.DRAFT },
    complianceChecks: [{
      name: { type: String },
      status: { type: String, enum: ['passed', 'failed', 'warning'] },
      message: { type: String }
    }],
    tenantId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Create compound index for faster queries
multiCountryPayrollSchema.index({ employeeId: 1, month: 1, year: 1, country: 1, tenantId: 1 }, { unique: true });
multiCountryPayrollSchema.index({ status: 1 });
multiCountryPayrollSchema.index({ country: 1 });
multiCountryPayrollSchema.index({ month: 1, year: 1 });

const TaxRule: Model<ITaxRule> = mongoose.model<ITaxRule>('TaxRule', taxRuleSchema);
const MultiCountryPayroll: Model<IMultiCountryPayroll> = mongoose.model<IMultiCountryPayroll>('MultiCountryPayroll', multiCountryPayrollSchema);

export { MultiCountryPayroll, TaxRule, CountryPayrollStatus };
