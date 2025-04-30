import mongoose, { Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Indexes for faster lookups
// Remove duplicate name index since it's already defined as unique in the schema
// SubjectSchema.index({ name: 1 });
SubjectSchema.index({ isActive: 1 });
// Add text index for search functionality
SubjectSchema.index({ name: 'text' });

export default mongoose.model<ISubject>("Subject", SubjectSchema);
