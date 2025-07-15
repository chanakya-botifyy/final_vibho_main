import mongoose, { Document, Schema } from 'mongoose';

export enum ClaimType {
  TRAVEL = 'travel',
  MEAL = 'meal',
  ACCOMMODATION = 'accommodation',
  MEDICAL = 'medical',
  COMMUNICATION = 'communication',
  TRAINING = 'training',
  OTHER = 'other'
}

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export interface IOCRData {
  vendor?: string;
  date?: string;
  amount?: number;
  taxAmount?: number;
  items?: string[];
}

export interface IReceipt {
  name: string;
  url: string;
  uploadDate: Date;
  size: number;
  type: string;
  ocrProcessed: boolean;
  ocrData?: IOCRData;
}

export interface IClaim extends Document {
  employeeId: mongoose.Types.ObjectId;
  type: ClaimType;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  category?: string;
  project?: string;
  department?: string;
  notes?: string;
  receipts: IReceipt[];
  status: ClaimStatus;
  submittedDate?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  rejectionReason?: string;
  paidDate?: Date;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ocrDataSchema = new Schema<IOCRData>({
  vendor: { type: String },
  date: { type: String },
  amount: { type: Number },
  taxAmount: { type: Number },
  items: [{ type: String }]
});

const receiptSchema = new Schema<IReceipt>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  ocrProcessed: { type: Boolean, default: false },
  ocrData: { type: ocrDataSchema }
});

const claimSchema = new Schema<IClaim>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(ClaimType),
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    category: {
      type: String
    },
    project: {
      type: String
    },
    department: {
      type: String
    },
    notes: {
      type: String
    },
    receipts: [receiptSchema],
    status: {
      type: String,
      enum: Object.values(ClaimStatus),
      default: ClaimStatus.DRAFT
    },
    submittedDate: {
      type: Date
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedDate: {
      type: Date
    },
    rejectionReason: {
      type: String
    },
    paidDate: {
      type: Date
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

// Create indexes for faster queries
claimSchema.index({ employeeId: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ type: 1 });
claimSchema.index({ date: 1 });
claimSchema.index({ tenantId: 1 });

export const Claim = mongoose.model<IClaim>('Claim', claimSchema);