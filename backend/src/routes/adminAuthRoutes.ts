import express from "express";
import {
  validateRequest,
  adminValidators,
} from "../middleware/validators";
import { protectAdmin, verifyRefreshToken } from "../middleware/auth";
import { authAdminController } from "../controllers";

const router = express.Router();

// @route   POST /api/admin/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post(
  "/login",
  adminValidators.adminLoginValidator,
  validateRequest,
  authAdminController.loginAdmin
);

// @route   POST /api/admin/auth/refresh
// @desc    Refresh admin access token
// @access  Public (with refresh token)
router.post("/refresh", verifyRefreshToken, authAdminController.refreshAccessToken);

// @route   POST /api/admin/auth/logout
// @desc    Logout admin and invalidate refresh token
// @access  Public
router.post("/logout", authAdminController.logout);

// @route   POST /api/admin/auth/logout-all
// @desc    Logout from all devices
// @access  Private/Admin
router.post("/logout-all", protectAdmin, authAdminController.logoutFromAllDevices);

export default router;
