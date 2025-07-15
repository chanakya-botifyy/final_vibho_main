import mongoose, { Document, Schema, Model } from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  WORK_FROM_HOME = 'work_from_home',
  ON_LEAVE = 'on_leave'
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

const geoLocationSchema = new Schema<GeoLocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String }
});

export interface RegularizationRequest {
  reason: string;
  requestedCheckIn?: Date;
  requestedCheckOut?: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  rejectionReason?: string;
}

const regularizationRequestSchema = new Schema<RegularizationRequest>({
  reason: { type: String, required: true },
  requestedCheckIn: { type: Date },
  requestedCheckOut: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedDate: { type: Date },
  rejectionReason: { type: String }
});

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakTime: number;
  breakStartTime?: Date;
  totalHours: number;
  overtime: number;
  status: AttendanceStatus;
  location?: GeoLocation;
  workLocation: 'office' | 'home' | 'client';
  notes?: string;
  regularizationRequest?: RegularizationRequest;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    checkIn: {
      type: Date
    },
    checkOut: {
      type: Date
    },
    breakTime: {
      type: Number,
      default: 0
    },
    breakStartTime: {
      type: Date
    },
    totalHours: {
      type: Number,
      default: 0
    },
    overtime: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.ABSENT
    },
    location: {
      type: geoLocationSchema
    },
    workLocation: {
      type: String,
      enum: ['office', 'home', 'client'],
      default: 'office'
    },
    notes: {
      type: String
    },
    regularizationRequest: {
      type: regularizationRequestSchema
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

// Create compound index for faster queries
attendanceSchema.index({ employeeId: 1, date: 1, tenantId: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ 'regularizationRequest.status': 1 });

const Attendance: Model<IAttendance> = mongoose.model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;
