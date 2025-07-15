const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please add an employee ID']
  },
  weekStartDate: {
    type: Date,
    required: [true, 'Please add a week start date']
  },
  weekEndDate: {
    type: Date,
    required: [true, 'Please add a week end date']
  },
  totalHours: {
    type: Number,
    required: [true, 'Please add total hours']
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: String
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  comments: {
    type: String
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

// Update the updatedAt field before save
TimesheetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Timesheet', TimesheetSchema);