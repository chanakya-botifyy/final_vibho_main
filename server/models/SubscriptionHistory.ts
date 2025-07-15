import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriptionHistory extends Document {
  tenantId: mongoose.Types.ObjectId;
  action: 'plan_change' | 'trial_started' | 'trial_ended' | 'suspension' | 'reactivation' | 'cancellation';
  fromPlan?: mongoose.Types.ObjectId;
  toPlan?: mongoose.Types.ObjectId;
  date: Date;
  performedBy: mongoose.Types.ObjectId;
  notes?: string;
  metadata?: Record<string, any>;
}

const SubscriptionHistorySchema = new Schema<ISubscriptionHistory>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  action: {
    type: String,
    enum: ['plan_change', 'trial_started', 'trial_ended', 'suspension', 'reactivation', 'cancellation'],
    required: true
  },
  fromPlan: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  toPlan: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  date: {
    type: Date,
    default: Date.now
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  }
});

const SubscriptionHistory = mongoose.model<ISubscriptionHistory>('SubscriptionHistory', SubscriptionHistorySchema);

export default SubscriptionHistory;