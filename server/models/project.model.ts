import mongoose, { Document, Schema, Model } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export type BillingType = 'hourly' | 'fixed' | 'non_billable';

export interface IProject extends Document {
  name: string;
  code: string;
  description?: string;
  client?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  manager?: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId[];
  budget?: number;
  billingType: BillingType;
  hourlyRate?: number;
  currency: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.ACTIVE },
    manager: { type: Schema.Types.ObjectId, ref: 'Employee' },
    team: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    budget: { type: Number },
    billingType: { type: String, enum: ['hourly', 'fixed', 'non_billable'], default: 'hourly' },
    hourlyRate: { type: Number },
    currency: { type: String, default: 'USD' },
    tenantId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Create indexes for faster queries
projectSchema.index({ name: 1, tenantId: 1 }, { unique: true });
projectSchema.index({ code: 1, tenantId: 1 }, { unique: true });
projectSchema.index({ status: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ manager: 1 });

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);

export { Project, ProjectStatus };
