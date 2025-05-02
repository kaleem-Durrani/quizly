/**
 * Authentication related types
 * These types are used throughout the application for authentication-related functionality
 */

// User roles in the application
export type UserRole = 'student' | 'teacher' | 'admin';

// Basic user information returned from authentication endpoints
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isVerified?: boolean;
  isFirstLogin?: boolean; // Only for teachers
  permissions?: string[]; // Only for admins
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

// Registration request payload for students
export interface RegisterStudentRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Authentication response from server
export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
    isFirstLogin?: boolean;
  };
  message?: string;
}

// Authentication status response
export interface AuthStatusResponse {
  success: boolean;
  isAuthenticated: boolean;
  user?: User;
  message?: string;
}

// Context type for authentication
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}
