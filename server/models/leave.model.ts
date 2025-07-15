import mongoose, { Document, Schema, Model } from 'mongoose';

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  EMERGENCY = 'emergency',
  UNPAID = 'unpaid'
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface ILeaveRequest extends Document {
  employeeId: mongoose.Types.ObjectId;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  rejectionReason?: string;
  documents: string[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeaveBalance extends Document {
  employeeId: mongoose.Types.ObjectId;
  annual: {
    total: number;
    used: number;
    remaining: number;
  };
  sick: {
    total: number;
    used: number;
    remaining: number;
  };
  maternity: {
    total: number;
    used: number;
    remaining: number;
  };
  paternity: {
    total: number;
    used: number;
    remaining: number;
  };
  emergency: {
    total: number;
    used: number;
    remaining: number;
  };
  year: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(LeaveType),
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING
    },
    appliedDate: {
      type: Date,
      default: Date.now
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
    documents: [{
      type: String
    }],
    tenantId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    annual: {
      total: { type: Number, required: true },
      used: { type: Number, default: 0 },
      remaining: { type: Number, required: true }
    },
    sick: {
      total: { type: Number, required: true },
      used: { type: Number, default: 0 },
      remaining: { type: Number, required: true }
    },
    maternity: {
      total: { type: Number, required: true },
      used: { type: Number, default: 0 },
      remaining: { type: Number, required: true }
    },
    paternity: {
      total: { type: Number, required: true },
      used: { type: Number, default: 0 },
      remaining: { type: Number, required: true }
    },
    emergency: {
      total: { type: Number, required: true },
      used: { type: Number, default: 0 },
      remaining: { type: Number, required: true }
    },
    year: {
      type: Number,
      required: true
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
leaveRequestSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ tenantId: 1 });

leaveBalanceSchema.index({ employeeId: 1, year: 1, tenantId: 1 }, { unique: true });

const LeaveRequest: Model<ILeaveRequest> = mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
const LeaveBalance: Model<ILeaveBalance> = mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);

export { LeaveRequest, LeaveBalance };
