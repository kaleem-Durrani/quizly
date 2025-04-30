import mongoose, { Document } from "mongoose";
import { ObjectId } from "../constants";

export interface IRefreshToken extends Document {
  token: string;
  userId: ObjectId;
  userType: string; // 'user' or 'admin'
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType",
  },
  userType: {
    type: String,
    required: true,
    enum: ["student", "teacher", "admin"],
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for faster queries
RefreshTokenSchema.index({ userId: 1, userType: 1 });
// Remove duplicate token index since it's already defined as unique in the schema
// RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ isRevoked: 1, expiresAt: 1 });
// TTL index to automatically remove expired tokens (this replaces the simple expiresAt index)
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
