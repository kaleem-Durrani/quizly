import mongoose, { Document } from "mongoose";
import { UserRole } from "../constants";

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole.ADMIN;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  permissions: string[];
  lastLogin?: Date;
}

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: UserRole.ADMIN, immutable: true },
  firstName: String,
  lastName: String,
  permissions: [{ type: String }],
  lastLogin: Date,
}, { timestamps: true });

// Note: We don't need to add explicit indexes for email and username
// as they are already defined as unique in the schema
// Add other useful indexes
AdminSchema.index({ role: 1 });

export default mongoose.model<IAdmin>("Admin", AdminSchema);
