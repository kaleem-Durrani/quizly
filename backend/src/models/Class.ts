import mongoose, { Document } from "mongoose";
import { ObjectId } from "../constants";

export interface IClass extends Document {
  name: string;
  description?: string;
  createdBy: ObjectId; // Teacher ID
  joinCode: string;
  joinCodeExpiry: Date;
  students: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
  },
  joinCodeExpiry: {
    type: Date,
    required: true,
    default: null,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false },
});

// Ensure a teacher cannot create classes with duplicate names
ClassSchema.index({ createdBy: 1, name: 1 }, { unique: true });

// Indexes for faster lookups
ClassSchema.index({ joinCode: 1 });
ClassSchema.index({ joinCodeExpiry: 1 });
ClassSchema.index({ isArchived: 1 });
// Index for querying classes by student IDs
ClassSchema.index({ students: 1 });

export default mongoose.model<IClass>("Class", ClassSchema);
