import mongoose, { Document, Schema, Model } from 'mongoose';

export type TaskStatus = 'active' | 'completed' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours: number;
  assignedTo: mongoose.Types.ObjectId[];
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: [true, 'Please add a project'] },
  name: { type: String, required: [true, 'Please add a task name'], trim: true, maxlength: [100, 'Task name cannot be more than 100 characters'] },
  description: { type: String, maxlength: [500, 'Description cannot be more than 500 characters'] },
  startDate: { type: Date },
  endDate: { type: Date },
  estimatedHours: { type: Number },
  actualHours: { type: Number, default: 0 },
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  status: { type: String, enum: ['active', 'completed', 'on_hold'], default: 'active' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before save
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);

export default Task;
