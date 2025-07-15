const mongoose = require('mongoose');

const TimesheetStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const timesheetEntrySchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    required: true 
  },
  task: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  hours: { 
    type: Number, 
    required: true,
    min: 0,
    max: 24
  },
  billable: { 
    type: Boolean, 
    default: true 
  },
  category: {
    type: String,
    enum: ['development', 'design', 'meeting', 'documentation', 'testing', 'other'],
    default: 'development'
  }
});

const timesheetSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    weekStartDate: {
      type: Date,
      required: true
    },
    weekEndDate: {
      type: Date,
      required: true
    },
    entries: [timesheetEntrySchema],
    totalHours: {
      type: Number,
      default: 0
    },
    billableHours: {
      type: Number,
      default: 0
    },
    nonBillableHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(TimesheetStatus),
      default: TimesheetStatus.DRAFT
    },
    submittedDate: {
      type: Date
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedDate: {
      type: Date
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: {
      type: String
    },
    comments: {
      type: String
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

// Pre-save hook to calculate total hours
timesheetSchema.pre('save', function(next) {
  if (this.entries && this.entries.length > 0) {
    this.totalHours = this.entries.reduce((sum, entry) => sum + entry.hours, 0);
    this.billableHours = this.entries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
    this.nonBillableHours = this.totalHours - this.billableHours;
  }
  next();
});

// Create compound index for faster queries
timesheetSchema.index({ employeeId: 1, weekStartDate: 1, tenantId: 1 }, { unique: true });
timesheetSchema.index({ status: 1 });
timesheetSchema.index({ weekStartDate: 1, weekEndDate: 1 });

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = { Timesheet, TimesheetStatus };