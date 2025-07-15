import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  adminUser: mongoose.Types.ObjectId;
  settings: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      logo?: string;
      favicon?: string;
    };
    features: {
      aiFeatures: boolean;
      multiCountryPayroll: boolean;
      whatsappIntegration: boolean;
      advancedAnalytics: boolean;
    };
    security: {
      mfa: boolean;
      passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        expiryDays: number;
      };
      ipRestriction: boolean;
      allowedIps?: string[];
    };
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
      push: boolean;
    };
  };
  metadata: {
    industry?: string;
    size?: string;
    country?: string;
    timezone?: string;
    language?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  isDeleted: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  adminUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    theme: {
      primaryColor: {
        type: String,
        default: '#1976d2'
      },
      secondaryColor: {
        type: String,
        default: '#9c27b0'
      },
      logo: String,
      favicon: String
    },
    features: {
      aiFeatures: {
        type: Boolean,
        default: false
      },
      multiCountryPayroll: {
        type: Boolean,
        default: false
      },
      whatsappIntegration: {
        type: Boolean,
        default: false
      },
      advancedAnalytics: {
        type: Boolean,
        default: false
      }
    },
    security: {
      mfa: {
        type: Boolean,
        default: false
      },
      passwordPolicy: {
        minLength: {
          type: Number,
          default: 8
        },
        requireUppercase: {
          type: Boolean,
          default: true
        },
        requireLowercase: {
          type: Boolean,
          default: true
        },
        requireNumbers: {
          type: Boolean,
          default: true
        },
        requireSpecialChars: {
          type: Boolean,
          default: true
        },
        expiryDays: {
          type: Number,
          default: 90
        }
      },
      ipRestriction: {
        type: Boolean,
        default: false
      },
      allowedIps: [String]
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      whatsapp: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  metadata: {
    industry: String,
    size: String,
    country: String,
    timezone: String,
    language: String,
    contactPerson: String,
    contactEmail: String,
    contactPhone: String
  },
  isDeleted: {
    type: Boolean,
    default: false
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

// Create a compound index for efficient querying
TenantSchema.index({ domain: 1, isDeleted: 1 });

const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);

export default Tenant;