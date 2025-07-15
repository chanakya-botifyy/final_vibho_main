import mongoose, { Document, Schema } from 'mongoose';

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected'
}

export interface IInterview {
  type: 'phone' | 'video' | 'in_person';
  date: Date;
  duration: number;
  interviewer: mongoose.Types.ObjectId;
  feedback?: string;
  rating?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface IJobPosting extends Document {
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience: string;
  salary: ISalaryRange;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed' | 'on_hold';
  postedDate: Date;
  closingDate: Date;
  postedBy: mongoose.Types.ObjectId;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  skills: string[];
  experience: number;
  currentSalary?: number;
  expectedSalary?: number;
  location: string;
  source: string;
  aiScore?: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: Date;
  interviews: IInterview[];
  rating?: number;
  notes?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const salaryRangeSchema = new Schema<ISalaryRange>({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  currency: { type: String, required: true }
});

const interviewSchema = new Schema<IInterview>({
  type: { 
    type: String, 
    enum: ['phone', 'video', 'in_person'],
    required: true 
  },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  interviewer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  feedback: { type: String },
  rating: { 
    type: Number,
    min: 1,
    max: 5
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
});

const jobPostingSchema = new Schema<IJobPosting>(
  {
    title: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    salary: {
      type: salaryRangeSchema,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    requirements: [{
      type: String
    }],
    benefits: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['active', 'closed', 'on_hold'],
      default: 'active'
    },
    postedDate: {
      type: Date,
      default: Date.now
    },
    closingDate: {
      type: Date,
      required: true
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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

const candidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    resumeUrl: {
      type: String,
      required: true
    },
    skills: [{
      type: String
    }],
    experience: {
      type: Number,
      required: true
    },
    currentSalary: {
      type: Number
    },
    expectedSalary: {
      type: Number
    },
    location: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    aiScore: {
      type: Number
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

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true
    },
    resumeUrl: {
      type: String,
      required: true
    },
    coverLetter: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    interviews: [interviewSchema],
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: {
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

// Create indexes for faster queries
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ department: 1 });
jobPostingSchema.index({ location: 1 });
jobPostingSchema.index({ tenantId: 1 });

candidateSchema.index({ email: 1 });
candidateSchema.index({ skills: 1 });
candidateSchema.index({ tenantId: 1 });

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ tenantId: 1 });

export const JobPosting = mongoose.model<IJobPosting>('JobPosting', jobPostingSchema);
export const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);
export const Application = mongoose.model<IApplication>('Application', applicationSchema);