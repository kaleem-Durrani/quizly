import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { Teacher } from "../models";
import { UserRole } from "../constants";
import {
  generateTokens,
  saveRefreshToken,
  refreshTokens,
  revokeRefreshToken,
  revokeAllUserTokens,
  setTokenCookies,
  clearTokenCookies,
} from "../utils/tokenUtils";
import { withTransaction } from "../utils/transactionUtils";
import asyncHandler from "../utils/asyncHandler";
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from "../utils/customErrors";

/**
 * Login for teacher users
 * @route POST /api/auth/teachers/login
 */
export const loginTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Check if teacher is banned
    if (teacher.isBanned) {
      throw new AuthenticationError(
        "Your account has been banned. Please contact administrator."
      );
    }

    const userId = teacher._id as Types.ObjectId;

    // Generate tokens
    const tokens = generateTokens({
      _id: userId.toString(),
      role: teacher.role,
    });

    // Use transaction to ensure both operations succeed or fail together
    await withTransaction(async (session) => {
      // Save refresh token to database
      await saveRefreshToken(tokens.refreshToken, userId.toString(), false, session);

      // Update last login
      teacher.lastLogin = new Date();
      await teacher.save({ session });
    });

    // Set tokens as HTTP-only cookies
    setTokenCookies(res, tokens);

    res.json({
      success: true,
      data: {
        _id: teacher._id,
        username: teacher.username,
        email: teacher.email,
        role: teacher.role,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        isFirstLogin: teacher.isFirstLogin,
      },
    });
  }
);

/**
 * Refresh teacher access token
 * @route POST /api/auth/teachers/refresh
 */
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // Get teacher from middleware
    const teacher = req.user;
    if (!teacher) {
      throw new AuthenticationError("Teacher not found");
    }

    const userId = teacher._id as Types.ObjectId;

    // Generate new tokens
    const newTokens = refreshTokens(refreshToken);
    if (!newTokens) {
      throw new AuthenticationError("Invalid refresh token");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Revoke old refresh token
      await revokeRefreshToken(refreshToken, session);

      // Save new refresh token
      await saveRefreshToken(newTokens.refreshToken, userId.toString(), false, session);
    });

    // Set new tokens as HTTP-only cookies
    setTokenCookies(res, newTokens);

    res.json({
      success: true,
      message: "Token refreshed successfully",
    });
  }
);

/**
 * Logout teacher
 * @route POST /api/auth/teachers/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Revoke the refresh token
      await revokeRefreshToken(refreshToken, session);
    });
  }

  // Clear token cookies
  clearTokenCookies(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * Logout from all devices
 * @route POST /api/auth/teachers/logout-all
 */
export const logoutFromAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    // Get teacher from middleware
    const teacher = req.user;
    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Revoke all refresh tokens for the teacher
      await revokeAllUserTokens(teacher._id.toString(), false, session);
    });

    // Clear token cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: "Logged out from all devices",
    });
  }
);

/**
 * Change teacher password
 * @route POST /api/auth/teachers/change-password
 */
export const changeTeacherPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const teacher = req.user;

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      throw new AuthenticationError("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPassword, salt);

    // If first login, update the flag
    if (teacher.isFirstLogin) {
      teacher.isFirstLogin = false;
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      await teacher.save({ session });
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
