import { Request, Response, NextFunction } from "express";
import { UserRole, TokenPayload } from "../constants";
import { Student, Teacher, Admin, RefreshToken } from "../models";
import { verifyToken } from "../utils/tokenUtils";
import {
  AuthenticationError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} from "../utils/customErrors";
import asyncHandler from "../utils/asyncHandler";

// Get JWT secrets from environment variables
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check for token in cookies first
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback to Authorization header for API clients
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AuthenticationError("Not authorized, no token");
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AuthenticationError("Not authorized, token invalid");
    }

    // Find user by id based on role
    let user;
    if (decoded.role === UserRole.STUDENT) {
      user = await Student.findById(decoded.id).select("-password");
    } else if (decoded.role === UserRole.TEACHER) {
      user = await Teacher.findById(decoded.id).select("-password");
    } else {
      throw new AuthenticationError("Invalid user role");
    }

    if (!user) {
      throw new AuthenticationError("Not authorized, user not found");
    }

    // Set user on request
    req.user = user;
    next();
  }
);

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Not authorized to access this resource");
    }

    next();
  };
};

/**
 * Middleware to protect admin routes
 */
export const protectAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check for token in cookies first
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Fallback to Authorization header for API clients
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AuthenticationError("Not authorized, no token");
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AuthenticationError("Not authorized, token invalid");
    }

    // Find admin by id
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      throw new AuthenticationError("Not authorized, admin not found");
    }

    // Set user on request
    req.user = admin;
    next();
  }
);

/**
 * Middleware to verify refresh token
 */
export const verifyRefreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // Check if token exists in database
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
    });

    if (!storedToken) {
      throw new AuthenticationError("Invalid refresh token");
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Mark token as revoked
      storedToken.isRevoked = true;
      await storedToken.save();

      throw new AuthenticationError("Refresh token expired");
    }

    // Verify token
    const decoded = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);

    if (!decoded) {
      throw new AuthenticationError("Not authorized, token invalid");
    }

    // Check if user exists based on userType
    let user;
    if (storedToken.userType === "Admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === UserRole.STUDENT) {
      user = await Student.findById(decoded.id).select("-password");
    } else if (decoded.role === UserRole.TEACHER) {
      user = await Teacher.findById(decoded.id).select("-password");
    } else {
      throw new NotFoundError("Invalid user type");
    }

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Set user on request
    req.user = user;
    next();
  }
);
