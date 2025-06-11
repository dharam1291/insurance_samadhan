import mongoose, { Document, Schema } from 'mongoose';

export interface IFraud extends Document {
  fraudId: string;
  phoneNumber: string;
  customerName: string;
  email?: string;
  fraudType: 'IDENTITY_THEFT' | 'UNAUTHORIZED_TRANSACTION' | 'ACCOUNT_TAKEOVER' | 'PHISHING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'UNDER_INVESTIGATION' | 'VERIFIED' | 'RESOLVED' | 'DISMISSED';
  description: string;
  evidenceFiles?: string[];
  transactionIds?: string[];
  amountInvolved?: number;
  currency?: string;
  incidentDate: Date;
  reportedDate: Date;
  investigatorId?: string;
  investigationNotes?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const fraudSchema = new Schema<IFraud>({
  fraudId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phoneNumber: {
    type: String,
    required: true,
    index: true,
    match: /^[\+]?[1-9][\d]{0,15}$/
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  fraudType: {
    type: String,
    enum: ['IDENTITY_THEFT', 'UNAUTHORIZED_TRANSACTION', 'ACCOUNT_TAKEOVER', 'PHISHING', 'OTHER'],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['REPORTED', 'UNDER_INVESTIGATION', 'VERIFIED', 'RESOLVED', 'DISMISSED'],
    default: 'REPORTED'
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  evidenceFiles: [{
    type: String,
    trim: true
  }],
  transactionIds: [{
    type: String,
    trim: true
  }],
  amountInvolved: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3
  },
  incidentDate: {
    type: Date,
    required: true
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  investigatorId: {
    type: String,
    trim: true
  },
  investigationNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'fraud' // Explicitly set collection name
});

// Indexes for better query performance
fraudSchema.index({ phoneNumber: 1, status: 1 });
fraudSchema.index({ fraudType: 1, severity: -1 });
fraudSchema.index({ reportedDate: -1 });
fraudSchema.index({ status: 1, severity: -1 });

export const Fraud = mongoose.model<IFraud>('Fraud', fraudSchema);