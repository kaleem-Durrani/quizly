import express from "express";
import {
  registerValidator,
  loginValidator,
  validateRequest,
  verifyEmailValidator,
  resendOtpValidator,
} from "../middleware/validators";
import { protect, verifyRefreshToken } from "../middleware/auth";
import { authStudentController } from "../controllers";

const router = express.Router();

// @route   POST /api/students/auth/register
// @desc    Register a student
// @access  Public
router.post(
  "/register",
  registerValidator,
  validateRequest,
  authStudentController.registerStudent
);

// @route   POST /api/students/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post(
  "/login",
  loginValidator,
  validateRequest,
  authStudentController.loginStudent
);

// @route   POST /api/students/auth/verify-email
// @desc    Verify student email with OTP
// @access  Public
router.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  authStudentController.verifyStudentEmail
);

// @route   POST /api/students/auth/resend-otp
// @desc    Resend verification OTP
// @access  Public
router.post(
  "/resend-otp",
  resendOtpValidator,
  validateRequest,
  authStudentController.resendVerificationOTP
);

// @route   POST /api/students/auth/refresh
// @desc    Refresh access token
// @access  Public (with refresh token)
router.post("/refresh", verifyRefreshToken, authStudentController.refreshAccessToken);

// @route   POST /api/students/auth/logout
// @desc    Logout student and invalidate refresh token
// @access  Public
router.post("/logout", authStudentController.logout);

// @route   POST /api/students/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post("/logout-all", protect, authStudentController.logoutFromAllDevices);

export default router;
