import mongoose, { Document } from "mongoose";
import { UserRole } from "../constants";

export interface ITeacher extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole.TEACHER;
  isFirstLogin: boolean;
  isBanned: boolean;
  banReason?: string;
  createdBy: mongoose.Types.ObjectId; // Admin who created the teacher account
  lastLogin?: Date;
  department?: string;
  classes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, default: UserRole.TEACHER, immutable: true },
  isFirstLogin: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  lastLogin: { type: Date },
  department: { type: String },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  createdAt: { type: Date, default: Date.now },
});

// Indexes for faster lookups
// Remove duplicate email and username indexes since they're already defined as unique in the schema
// TeacherSchema.index({ email: 1 });
// TeacherSchema.index({ username: 1 });
TeacherSchema.index({ isBanned: 1 });
TeacherSchema.index({ department: 1 });
TeacherSchema.index({ createdBy: 1 });

export default mongoose.model<ITeacher>("Teacher", TeacherSchema);
