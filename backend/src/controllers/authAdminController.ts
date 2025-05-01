import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { Admin } from "../models";
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
 * Login for admin users
 * @route POST /api/auth/admin/login
 */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find admin by email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new AuthenticationError("Invalid credentials");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new AuthenticationError("Invalid credentials");
  }

  const adminId = admin._id as Types.ObjectId;

  // Generate tokens
  const tokens = generateTokens({
    _id: adminId.toString(),
    role: admin.role,
  });

  // Use the transaction utility to handle the transaction
  await withTransaction(async (session) => {
    // Save refresh token to database
    await saveRefreshToken(tokens.refreshToken, adminId.toString(), true, session);
  });

  // Set tokens as HTTP-only cookies
  setTokenCookies(res, tokens);

  res.json({
    success: true,
    data: {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
  });
});

/**
 * Refresh admin access token
 * @route POST /api/auth/admin/refresh
 */
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // Get admin from middleware
    const admin = req.user;
    if (!admin) {
      throw new AuthenticationError("Admin not found");
    }

    const adminId = admin._id as Types.ObjectId;

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
      await saveRefreshToken(newTokens.refreshToken, adminId.toString(), true, session);
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
 * Logout admin
 * @route POST /api/auth/admin/logout
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
 * @route POST /api/auth/admin/logout-all
 */
export const logoutFromAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    // Get admin from middleware
    const admin = req.user;
    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Revoke all refresh tokens for the admin
      await revokeAllUserTokens(admin._id.toString(), true, session);
    });

    // Clear token cookies
    clearTokenCookies(res);

    res.json({
      success: true,
      message: "Logged out from all devices",
    });
  }
);
