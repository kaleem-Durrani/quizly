import express from "express";
import {
  loginValidator,
  validateRequest,
  changePasswordValidator,
} from "../middleware/validators";
import { protect, restrictTo, verifyRefreshToken } from "../middleware/auth";
import { UserRole } from "../constants";
import { authTeacherController } from "../controllers";

const router = express.Router();

// @route   POST /api/teachers/auth/login
// @desc    Authenticate teacher & get token
// @access  Public
router.post(
  "/login",
  loginValidator,
  validateRequest,
  authTeacherController.loginTeacher
);

// @route   POST /api/teachers/auth/change-password
// @desc    Change password after first login
// @access  Private/Teacher
router.post(
  "/change-password",
  changePasswordValidator,
  validateRequest,
  protect,
  restrictTo(UserRole.TEACHER),
  authTeacherController.changeTeacherPassword
);

// @route   POST /api/teachers/auth/refresh
// @desc    Refresh access token
// @access  Public (with refresh token)
router.post("/refresh", verifyRefreshToken, authTeacherController.refreshAccessToken);

// @route   POST /api/teachers/auth/logout
// @desc    Logout teacher and invalidate refresh token
// @access  Public
router.post("/logout", authTeacherController.logout);

// @route   POST /api/teachers/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post("/logout-all", protect, authTeacherController.logoutFromAllDevices);

export default router;
