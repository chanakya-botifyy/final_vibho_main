const mongoose = require('mongoose');

const TimesheetEntrySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please add an employee ID']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Please add a project']
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Please add a task']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  hours: {
    type: Number,
    required: [true, 'Please add hours'],
    min: [0.5, 'Hours must be at least 0.5'],
    max: [24, 'Hours cannot exceed 24']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  billable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
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
TimesheetEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TimesheetEntry', TimesheetEntrySchema);