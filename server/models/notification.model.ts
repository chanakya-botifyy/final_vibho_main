import mongoose, { Document, Schema, Model } from 'mongoose';

export enum NotificationType {
  LEAVE_REQUEST = 'leave_request',
  ATTENDANCE_ALERT = 'attendance_alert',
  PAYROLL_PROCESSED = 'payroll_processed',
  DOCUMENT_EXPIRY = 'document_expiry',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  SYSTEM_ALERT = 'system_alert',
  PERFORMANCE_REVIEW = 'performance_review',
  CLAIM_STATUS = 'claim_status',
  RECRUITMENT = 'recruitment'
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    actionUrl: { type: String },
    metadata: { type: Schema.Types.Mixed },
    tenantId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Create indexes for faster queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: 1 });
notificationSchema.index({ tenantId: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export { Notification, NotificationType };
