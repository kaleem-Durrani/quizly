import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { Student } from "../models";
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
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
} from "../utils/emailUtils";

/**
 * Register a new student
 * @route POST /api/auth/students/register
 */
export const registerStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if student already exists
    const userExists = await Student.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      throw new BadRequestError("Student already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // OTP valid for 1 hour

    // Use the transaction utility to handle the transaction
    const result = await withTransaction(async (session) => {
      // Create student
      const student = await Student.create([{
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.STUDENT,
        isVerified: false,
        verificationOTP: otp,
        otpExpiry,
      }], { session });

      if (!student || student.length === 0) {
        throw new BadRequestError("Invalid student data");
      }

      const createdStudent = student[0];
      const userId = createdStudent._id as Types.ObjectId;

      // Generate tokens
      const tokens = generateTokens({
        _id: userId.toString(),
        role: createdStudent.role,
      });

      // Save refresh token to database
      await saveRefreshToken(tokens.refreshToken, userId.toString(), false, session);

      return {
        student: createdStudent,
        tokens
      };
    });

    try {
      // Send verification email with OTP
      await sendVerificationEmail(
        email,
        otp,
        firstName
      );
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue with the response even if email fails
      // In production, you might want to handle this differently
    }

    // Set tokens as HTTP-only cookies
    setTokenCookies(res, result.tokens);

    res.status(201).json({
      success: true,
      data: {
        _id: result.student._id,
        username: result.student.username,
        email: result.student.email,
        role: result.student.role,
        firstName: result.student.firstName,
        lastName: result.student.lastName,
        isVerified: result.student.isVerified,
        // Don't send OTP in production
        ...(process.env.NODE_ENV === 'development' ? { otp } : {})
      },
    });
  }
);

/**
 * Login for student users
 * @route POST /api/auth/students/login
 */
export const loginStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Check if student is verified
    if (!student.isVerified) {
      throw new AuthenticationError(
        "Email not verified. Please verify your email."
      );
    }

    const userId = student._id as Types.ObjectId;

    // Generate tokens
    const tokens = generateTokens({
      _id: userId.toString(),
      role: student.role,
    });

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Save refresh token to database
      await saveRefreshToken(tokens.refreshToken, userId.toString(), false, session);
    });

    // Set tokens as HTTP-only cookies
    setTokenCookies(res, tokens);

    res.json({
      success: true,
      data: {
        _id: student._id,
        username: student.username,
        email: student.email,
        role: student.role,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    });
  }
);

/**
 * Refresh student access token
 * @route POST /api/auth/students/refresh
 */
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    // Get student from middleware
    const student = req.user;
    if (!student) {
      throw new AuthenticationError("Student not found");
    }

    const userId = student._id as Types.ObjectId;

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
 * Logout student
 * @route POST /api/auth/students/logout
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
 * @route POST /api/auth/students/logout-all
 */
export const logoutFromAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    // Get student from middleware
    const student = req.user;
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Revoke all refresh tokens for the student
      await revokeAllUserTokens(student._id.toString(), false, session);
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
 * Verify student email with OTP
 * @route POST /api/auth/students/verify-email
 */
export const verifyStudentEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check if OTP exists and is valid
    if (!student.verificationOTP || student.verificationOTP !== otp) {
      throw new BadRequestError("Invalid OTP");
    }

    // Check if OTP has expired
    if (student.otpExpiry && student.otpExpiry < new Date()) {
      throw new BadRequestError("OTP has expired");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Verify student account
      student.isVerified = true;
      student.verificationOTP = undefined;
      student.otpExpiry = undefined;
      await student.save({ session });
    });

    try {
      // Send welcome email after successful verification
      await sendWelcomeEmail(
        email,
        student.firstName
      );
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  }
);

/**
 * Resend verification OTP
 * @route POST /api/auth/students/resend-otp
 */
export const resendVerificationOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check if already verified
    if (student.isVerified) {
      throw new BadRequestError("Email already verified");
    }

    // Check if there's an existing non-expired OTP
    const now = new Date();
    if (student.otpExpiry && student.otpExpiry > now) {
      const timeRemaining = Math.ceil((student.otpExpiry.getTime() - now.getTime()) / (1000 * 60));
      throw new BadRequestError(
        `Please wait for the current OTP to expire. Try again in ${timeRemaining} minutes.`
      );
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // OTP valid for 1 hour

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Save OTP and expiry
      student.verificationOTP = otp;
      student.otpExpiry = otpExpiry;
      await student.save({ session });
    });

    try {
      // Send verification email with OTP
      await sendVerificationEmail(
        email,
        otp,
        student.firstName
      );
      console.log(`Verification email resent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: "Verification OTP sent to your email",
      data: {
        // Only include OTP in development mode
        ...(process.env.NODE_ENV === 'development' ? { otp } : {})
      },
    });
  }
);

/**
 * Request password reset
 * @route POST /api/auth/students/forgot-password
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check if student is verified
    if (!student.isVerified) {
      throw new BadRequestError("Account not verified. Please verify your email first.");
    }

    // Check if there's an existing non-expired OTP
    const now = new Date();
    if (student.otpExpiry && student.otpExpiry > now) {
      const timeRemaining = Math.ceil((student.otpExpiry.getTime() - now.getTime()) / (1000 * 60));
      throw new BadRequestError(
        `Please wait for the current OTP to expire. Try again in ${timeRemaining} minutes.`
      );
    }

    // Generate reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // OTP valid for 1 hour

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Save OTP and expiry
      student.verificationOTP = otp;
      student.otpExpiry = otpExpiry;
      await student.save({ session });
    });

    try {
      // Send password reset email with OTP
      await sendPasswordResetEmail(
        email,
        otp,
        student.firstName
      );
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      // Continue with the response even if email fails
    }

    res.json({
      success: true,
      message: "Password reset instructions sent to your email",
      data: {
        // Only include OTP in development mode
        ...(process.env.NODE_ENV === 'development' ? { otp } : {})
      },
    });
  }
);

/**
 * Reset password with OTP
 * @route POST /api/auth/students/reset-password
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check if OTP exists and is valid
    if (!student.verificationOTP || student.verificationOTP !== otp) {
      throw new BadRequestError("Invalid OTP");
    }

    // Check if OTP has expired
    if (student.otpExpiry && student.otpExpiry < new Date()) {
      throw new BadRequestError("OTP has expired");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      // Update password and clear OTP
      student.password = hashedPassword;
      student.verificationOTP = undefined;
      student.otpExpiry = undefined;
      await student.save({ session });

      // Revoke all refresh tokens for the student for security
      const userId = student._id as Types.ObjectId;
      await revokeAllUserTokens(userId.toString(), false, session);
    });

    res.json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  }
);
