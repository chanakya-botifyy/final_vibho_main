import mongoose, { Document, Schema } from 'mongoose';

export enum AssetCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged'
}

export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  IN_REPAIR = 'in_repair',
  DISPOSED = 'disposed'
}

export interface IMaintenanceRecord {
  date: Date;
  description: string;
  cost: number;
  vendor: string;
  nextMaintenanceDate?: Date;
  performedBy?: mongoose.Types.ObjectId;
}

export interface IAsset extends Document {
  name: string;
  category: string;
  serialNumber: string;
  qrCode: string;
  assignedTo?: mongoose.Types.ObjectId;
  assignedDate?: Date;
  location: string;
  condition: AssetCondition;
  purchaseDate: Date;
  purchasePrice: number;
  warranty: Date;
  vendor: string;
  description?: string;
  status: AssetStatus;
  maintenanceHistory: IMaintenanceRecord[];
  documents: string[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceRecordSchema = new Schema<IMaintenanceRecord>({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  vendor: { type: String, required: true },
  nextMaintenanceDate: { type: Date },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const assetSchema = new Schema<IAsset>(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true
    },
    qrCode: {
      type: String,
      required: true,
      unique: true
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    },
    assignedDate: {
      type: Date
    },
    location: {
      type: String,
      required: true
    },
    condition: {
      type: String,
      enum: Object.values(AssetCondition),
      default: AssetCondition.NEW
    },
    purchaseDate: {
      type: Date,
      required: true
    },
    purchasePrice: {
      type: Number,
      required: true
    },
    warranty: {
      type: Date,
      required: true
    },
    vendor: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(AssetStatus),
      default: AssetStatus.AVAILABLE
    },
    maintenanceHistory: [maintenanceRecordSchema],
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

// Create indexes for faster queries
assetSchema.index({ serialNumber: 1 });
assetSchema.index({ qrCode: 1 });
assetSchema.index({ assignedTo: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ category: 1 });
assetSchema.index({ tenantId: 1 });

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);