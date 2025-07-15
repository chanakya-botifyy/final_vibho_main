import mongoose, { Document, Schema, Model } from 'mongoose';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ABSCONDED = 'absconded',
  ON_LEAVE = 'on_leave'
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus: string;
  nationality: string;
  address: IAddress;
  emergencyContact: IEmergencyContact;
}

export interface ICompanyInfo {
  department: string;
  designation: string;
  reportingManager: string;
  dateOfJoining: Date;
  employmentType: string;
  workLocation: string;
  shift: string;
  probationPeriod: number;
  confirmationDate?: Date;
}

export interface IBankInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  ifscCode?: string;
  swiftCode?: string;
}

export interface IDocument {
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  expiryDate?: Date;
  verified: boolean;
}

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
  grade: string;
  documents: IDocument[];
}

export interface IPreviousEmployment {
  company: string;
  designation: string;
  startDate: Date;
  endDate: Date;
  salary: number;
  reasonForLeaving: string;
  documents: IDocument[];
}

export interface IEmployee extends Document {
  employeeId: string;
  userId: mongoose.Types.ObjectId;
  personalInfo: IPersonalInfo;
  companyInfo: ICompanyInfo;
  bankInfo: IBankInfo;
  documents: IDocument[];
  qualifications: IQualification[];
  previousEmployment: IPreviousEmployment[];
  status: EmployeeStatus;
  onboardingStep: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const emergencyContactSchema = new Schema<IEmergencyContact>({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }
});

const personalInfoSchema = new Schema<IPersonalInfo>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: addressSchema, required: true },
  emergencyContact: { type: emergencyContactSchema, required: true }
});

const companyInfoSchema = new Schema<ICompanyInfo>({
  department: { type: String, required: true },
  designation: { type: String, required: true },
  reportingManager: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  employmentType: { type: String, required: true },
  workLocation: { type: String, required: true },
  shift: { type: String, required: true },
  probationPeriod: { type: Number, required: true },
  confirmationDate: { type: Date }
});

const bankInfoSchema = new Schema<IBankInfo>({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  routingNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  ifscCode: { type: String },
  swiftCode: { type: String }
});

const documentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  verified: { type: Boolean, default: false }
});

const qualificationSchema = new Schema<IQualification>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: Number, required: true },
  grade: { type: String, required: true },
  documents: [documentSchema]
});

const previousEmploymentSchema = new Schema<IPreviousEmployment>({
  company: { type: String, required: true },
  designation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  reasonForLeaving: { type: String, required: true },
  documents: [documentSchema]
});

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    personalInfo: {
      type: personalInfoSchema,
      required: true
    },
    companyInfo: {
      type: companyInfoSchema,
      required: true
    },
    bankInfo: {
      type: bankInfoSchema,
      required: true
    },
    documents: [documentSchema],
    qualifications: [qualificationSchema],
    previousEmployment: [previousEmploymentSchema],
    status: {
      type: String,
      enum: Object.values(EmployeeStatus),
      default: EmployeeStatus.ACTIVE
    },
    onboardingStep: {
      type: Number,
      default: 1
    },
    tenantId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for faster queries
employeeSchema.index({ employeeId: 1, tenantId: 1 }, { unique: true });
employeeSchema.index({ 'personalInfo.email': 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ 'companyInfo.department': 1 });

const Employee: Model<IEmployee> = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
