import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import { Response } from "express";
import { RefreshToken } from "../models";
import {
  UserRole,
  Tokens,
  TokenPayload as BaseTokenPayload,
} from "../constants";

// Get JWT secrets from environment variables
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

// Get token expiration times from environment variables
const REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

/**
 * Interface for the payload of JWT tokens
 */
interface TokenPayload extends BaseTokenPayload {
  isAdmin?: boolean;
}

/**
 * Interface for user or admin objects that can be used to generate tokens
 */
interface TokenUser {
  _id: Types.ObjectId | string;
  role: UserRole;
}

/**
 * Generate access and refresh tokens for a user or admin
 * @param user User or Admin document
 * @returns Object containing access and refresh tokens
 */
export const generateTokens = (user: TokenUser): Tokens => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
    isAdmin: user.role === UserRole.ADMIN,
  };

  // Generate access token
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET);

  // Generate refresh token
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);

  return { accessToken, refreshToken };
};

/**
 * Generate new tokens using a refresh token
 * @param refreshToken Existing refresh token
 * @returns New tokens or null if refresh token is invalid
 */
export const refreshTokens = (refreshToken: string): Tokens | null => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as TokenPayload;

    // Generate new tokens
    const payload: TokenPayload = {
      id: decoded.id,
      role: decoded.role,
      isAdmin: decoded.role === UserRole.ADMIN,
    };

    // Generate new access token
    const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET);

    // Generate new refresh token
    const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return null;
  }
};

/**
 * Calculate refresh token expiration time in seconds
 * @returns Expiration time in seconds
 */
export const calculateRefreshExpiration = (): number => {
  // Default to 7 days if not specified
  const refreshExpire = REFRESH_TOKEN_EXPIRE || "7d";

  // Parse the expiration format (e.g., "7d", "24h", "60m")
  const value = parseInt(refreshExpire);
  const unit = refreshExpire.slice(String(value).length);

  // Convert to seconds based on unit
  switch (unit) {
    case "d": // days
      return value * 24 * 60 * 60;
    case "h": // hours
      return value * 60 * 60;
    case "m": // minutes
      return value * 60;
    case "s": // seconds
      return value;
    default:
      // Default to 7 days
      return 7 * 24 * 60 * 60;
  }
};

/**
 * Save refresh token to database
 * @param token Refresh token
 * @param userId User ID
 * @param userRole User role (admin, teacher, or student)
 * @param session Optional Mongoose session for transactions
 */
export const saveRefreshToken = async (
  token: string,
  userId: string,
  userRole: UserRole | string,
  session?: mongoose.ClientSession
): Promise<void> => {
  // Calculate expiration time
  const expiresIn = calculateRefreshExpiration();
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Map user role to userType
  let userType: string;
  if (userRole === UserRole.ADMIN) {
    userType = "admin";
  } else if (userRole === UserRole.TEACHER) {
    userType = "teacher";
  } else if (userRole === UserRole.STUDENT) {
    userType = "student";
  } else {
    // Default to student if role is not recognized
    userType = "student";
  }

  // Create refresh token document
  const refreshTokenData = {
    token,
    userId,
    userType,
    expiresAt,
  };

  if (session) {
    await RefreshToken.create([refreshTokenData], { session });
  } else {
    await RefreshToken.create(refreshTokenData);
  }
};

/**
 * Revoke a specific refresh token
 * @param token Refresh token to revoke
 * @param session Optional Mongoose session for transactions
 */
export const revokeRefreshToken = async (
  token: string,
  session?: mongoose.ClientSession
): Promise<void> => {
  if (session) {
    await RefreshToken.findOneAndUpdate(
      { token },
      { isRevoked: true },
      { session }
    );
  } else {
    await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
  }
};

/**
 * Revoke all refresh tokens for a user
 * @param userId User ID
 * @param userRole User role (admin, teacher, or student)
 * @param session Optional Mongoose session for transactions
 */
export const revokeAllUserTokens = async (
  userId: string,
  userRole: UserRole | string,
  session?: mongoose.ClientSession
): Promise<void> => {
  // Map user role to userType
  let userType: string;
  if (userRole === UserRole.ADMIN) {
    userType = "admin";
  } else if (userRole === UserRole.TEACHER) {
    userType = "teacher";
  } else if (userRole === UserRole.STUDENT) {
    userType = "student";
  } else {
    // Default to student if role is not recognized
    userType = "student";
  }

  if (session) {
    await RefreshToken.updateMany(
      { userId, userType },
      { isRevoked: true },
      { session }
    );
  } else {
    await RefreshToken.updateMany(
      { userId, userType },
      { isRevoked: true }
    );
  }
};

/**
 * Clean up expired or revoked tokens
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  await RefreshToken.deleteMany({
    $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
  });
};

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @param secret Secret used to sign the token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (
  token: string,
  secret: string = ACCESS_TOKEN_SECRET
): TokenPayload | null => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Set tokens as HTTP-only cookies
 * @param res Express response object
 * @param tokens Access and refresh tokens
 */
export const setTokenCookies = (res: Response, tokens: Tokens): void => {
  // Parse the expiration format for access token
  const accessExpire = process.env.JWT_ACCESS_EXPIRE || "15m";
  const accessValue = parseInt(accessExpire);
  const accessUnit = accessExpire.slice(String(accessValue).length);

  // Calculate access token expiry in milliseconds
  let accessExpireMs = 15 * 60 * 1000; // Default 15 minutes
  switch (accessUnit) {
    case "d": // days
      accessExpireMs = accessValue * 24 * 60 * 60 * 1000;
      break;
    case "h": // hours
      accessExpireMs = accessValue * 60 * 60 * 1000;
      break;
    case "m": // minutes
      accessExpireMs = accessValue * 60 * 1000;
      break;
    case "s": // seconds
      accessExpireMs = accessValue * 1000;
      break;
  }

  // Calculate refresh token expiry in milliseconds
  const refreshExpireSeconds = calculateRefreshExpiration();
  const refreshExpireMs = refreshExpireSeconds * 1000;

  // Set access token cookie
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: accessExpireMs,
  });

  // Set refresh token cookie
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: refreshExpireMs,
  });
};

/**
 * Clear token cookies
 * @param res Express response object
 */
export const clearTokenCookies = (res: Response): void => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
};
