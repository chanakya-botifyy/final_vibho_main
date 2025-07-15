import mongoose, { Document, Schema } from 'mongoose';

export interface IPerformanceReview extends Document {
  employeeId: mongoose.Types.ObjectId;
  reviewPeriod: string;
  reviewDate: Date;
  reviewType: 'annual' | 'quarterly' | 'probation' | 'project';
  overallRating: number;
  currentDesignation: string;
  newDesignation?: string;
  currentSalary: number;
  newSalary?: number;
  percentageHike?: number;
  hrComments?: string;
  managerComments?: string;
  employeeComments?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'acknowledged';
  strengths: string[];
  areasOfImprovement: string[];
  trainingRecommendations: string[];
  createdBy: mongoose.Types.ObjectId;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerformanceGoal extends Document {
  employeeId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'project' | 'learning';
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  metrics: string;
  feedback?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICareerPath extends Document {
  employeeId: mongoose.Types.ObjectId;
  currentRole: string;
  targetRole: string;
  requiredSkills: string[];
  requiredTraining: string[];
  estimatedTimeframe: number;
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkillAssessment extends Document {
  employeeId: mongoose.Types.ObjectId;
  skillName: string;
  category: 'technical' | 'soft' | 'leadership';
  currentLevel: number;
  targetLevel: number;
  lastAssessedDate: Date;
  assessedBy: mongoose.Types.ObjectId;
  comments?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const performanceReviewSchema = new Schema<IPerformanceReview>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    reviewPeriod: {
      type: String,
      required: true
    },
    reviewDate: {
      type: Date,
      required: true
    },
    reviewType: {
      type: String,
      enum: ['annual', 'quarterly', 'probation', 'project'],
      required: true
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    currentDesignation: {
      type: String,
      required: true
    },
    newDesignation: {
      type: String
    },
    currentSalary: {
      type: Number,
      required: true
    },
    newSalary: {
      type: Number
    },
    percentageHike: {
      type: Number
    },
    hrComments: {
      type: String
    },
    managerComments: {
      type: String
    },
    employeeComments: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed', 'acknowledged'],
      default: 'draft'
    },
    strengths: [{
      type: String
    }],
    areasOfImprovement: [{
      type: String
    }],
    trainingRecommendations: [{
      type: String
    }],
    createdBy: {
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

const performanceGoalSchema = new Schema<IPerformanceGoal>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['professional', 'personal', 'project', 'learning'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    targetDate: {
      type: Date,
      required: true
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
      default: 'not_started'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    metrics: {
      type: String,
      required: true
    },
    feedback: {
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

const careerPathSchema = new Schema<ICareerPath>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    currentRole: {
      type: String,
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    requiredSkills: [{
      type: String
    }],
    requiredTraining: [{
      type: String
    }],
    estimatedTimeframe: {
      type: Number,
      required: true
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'on_hold'],
      default: 'active'
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

const skillAssessmentSchema = new Schema<ISkillAssessment>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['technical', 'soft', 'leadership'],
      required: true
    },
    currentLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    targetLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    lastAssessedDate: {
      type: Date,
      default: Date.now
    },
    assessedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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

// Create indexes for faster queries
performanceReviewSchema.index({ employeeId: 1, reviewPeriod: 1 });
performanceReviewSchema.index({ status: 1 });
performanceReviewSchema.index({ tenantId: 1 });

performanceGoalSchema.index({ employeeId: 1 });
performanceGoalSchema.index({ status: 1 });
performanceGoalSchema.index({ category: 1 });
performanceGoalSchema.index({ tenantId: 1 });

careerPathSchema.index({ employeeId: 1 });
careerPathSchema.index({ status: 1 });
careerPathSchema.index({ tenantId: 1 });

skillAssessmentSchema.index({ employeeId: 1, skillName: 1 });
skillAssessmentSchema.index({ category: 1 });
skillAssessmentSchema.index({ tenantId: 1 });

export const PerformanceReview = mongoose.model<IPerformanceReview>('PerformanceReview', performanceReviewSchema);
export const PerformanceGoal = mongoose.model<IPerformanceGoal>('PerformanceGoal', performanceGoalSchema);
export const CareerPath = mongoose.model<ICareerPath>('CareerPath', careerPathSchema);
export const SkillAssessment = mongoose.model<ISkillAssessment>('SkillAssessment', skillAssessmentSchema);