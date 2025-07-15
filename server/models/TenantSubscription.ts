import mongoose, { Document, Schema } from 'mongoose';

export interface ITenantSubscription extends Document {
  tenantId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  lastBillingDate?: Date;
  nextBillingDate?: Date;
  paymentMethod?: string;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    expiryDate?: string;
  };
  autoRenew: boolean;
  usageData?: {
    users: number;
    storage: number;
    apiRequests: number;
  };
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSubscriptionSchema = new Schema<ITenantSubscription>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'trial', 'suspended', 'cancelled'],
    default: 'trial'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  trialEndDate: {
    type: Date
  },
  lastBillingDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  paymentMethod: {
    type: String
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    expiryDate: String
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  usageData: {
    users: {
      type: Number,
      default: 0
    },
    storage: {
      type: Number,
      default: 0
    },
    apiRequests: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const TenantSubscription = mongoose.model<ITenantSubscription>('TenantSubscription', TenantSubscriptionSchema);

export default TenantSubscription;