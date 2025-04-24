import { Types } from "mongoose";

// User roles
export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

// Mongoose ID type
export type ObjectId = Types.ObjectId;

// Question types
export enum QuestionType {
  MCQ = "mcq",
  WRITTEN = "written",
}

// Common response
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Token types
export interface TokenPayload {
  id: string;
  role?: UserRole | string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
