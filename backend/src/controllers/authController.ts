import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { UserRole } from "../constants";

/**
 * Check authentication status
 * @route GET /api/auth/status
 * @description This endpoint checks if the user is authenticated and returns user data
 * It works with all user types (student, teacher, admin) based on the cookies
 */
export const checkAuthStatus = asyncHandler(
  async (req: Request, res: Response) => {
    // If this middleware is reached, the user is authenticated
    // because the auth middleware would have thrown an error otherwise
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        isAuthenticated: false,
        message: "Not authenticated"
      });
    }

    // Return user data based on role
    res.json({
      success: true,
      isAuthenticated: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        ...(user.role === UserRole.STUDENT ? { isVerified: user.isVerified } : {}),
        // Include role-specific properties
        ...(user.role === UserRole.TEACHER ? { isFirstLogin: user.isFirstLogin } : {}),
        ...(user.role === UserRole.ADMIN ? { permissions: user.permissions } : {}),
      },
    });
  }
);
