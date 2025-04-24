import mongoose, { Document } from "mongoose";
import { UserRole } from "../constants";

export interface IStudent extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole.STUDENT;
  isVerified: boolean;
  verificationOTP?: string;
  otpExpiry?: Date;
  isBanned: boolean;
  banReason?: string;
  classes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, default: UserRole.STUDENT, immutable: true },
  isVerified: { type: Boolean, default: false },
  verificationOTP: { type: String },
  otpExpiry: { type: Date },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
}, { timestamps: true });

// Indexes for faster lookups
StudentSchema.index({ email: 1 });
StudentSchema.index({ username: 1 });
StudentSchema.index({ isVerified: 1 });
StudentSchema.index({ isBanned: 1 });
// Index for querying students by class
StudentSchema.index({ classes: 1 });
// Index for OTP expiry
StudentSchema.index({ otpExpiry: 1 });
// Compound index for verification and ban status
StudentSchema.index({ isVerified: 1, isBanned: 1 });

export default mongoose.model<IStudent>("Student", StudentSchema);
