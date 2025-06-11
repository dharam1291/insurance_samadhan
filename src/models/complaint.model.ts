import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  complaintId: string;
  phoneNumber: string;
  customerName: string;
  email?: string;
  category: 'SERVICE' | 'BILLING' | 'TECHNICAL' | 'PRODUCT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  subject: string;
  description: string;
  attachments?: string[];
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const complaintSchema = new Schema<IComplaint>({
  complaintId: {
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
  category: {
    type: String,
    enum: ['SERVICE', 'BILLING', 'TECHNICAL', 'PRODUCT', 'OTHER'],
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'],
    default: 'OPEN'
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  attachments: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: String,
    trim: true
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
  collection: 'complaints' // Explicitly set collection name
});

// Indexes for better query performance
complaintSchema.index({ phoneNumber: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ status: 1, priority: -1 });

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);