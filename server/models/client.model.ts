import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IContactPerson {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
}

export interface ICompany {
  name: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country: string;
    zipCode?: string;
  };
  website?: string;
  industry?: string;
}

export interface IBillingInfo {
  currency: string;
  paymentTerms?: string;
  taxId?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    swiftCode?: string;
  };
}

export interface IClient extends Document {
  name: string;
  code: string;
  contactPerson: IContactPerson;
  company: ICompany;
  billingInfo: IBillingInfo;
  status: 'active' | 'inactive';
  notes?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactPersonSchema = new Schema<IContactPerson>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  designation: { type: String }
});

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String }
  },
  website: { type: String },
  industry: { type: String }
});

const billingInfoSchema = new Schema<IBillingInfo>({
  currency: { type: String, default: 'USD' },
  paymentTerms: { type: String },
  taxId: { type: String },
  bankDetails: {
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    swiftCode: { type: String }
  }
});

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    contactPerson: { type: contactPersonSchema, required: true },
    company: { type: companySchema, required: true },
    billingInfo: { type: billingInfoSchema },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String },
    tenantId: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// Create indexes for faster queries
clientSchema.index({ name: 1, tenantId: 1 }, { unique: true });
clientSchema.index({ code: 1, tenantId: 1 }, { unique: true });
clientSchema.index({ 'company.industry': 1 });
clientSchema.index({ status: 1 });

const Client: Model<IClient> = mongoose.model<IClient>('Client', clientSchema);

export default Client;
