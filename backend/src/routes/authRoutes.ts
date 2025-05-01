import express from "express";
import { protect, protectAdmin } from "../middleware/auth";
import * as authController from "../controllers/authController";

const router = express.Router();

// @route   GET /api/auth/status
// @desc    Check authentication status for students and teachers
// @access  Private
router.get("/status", protect, authController.checkAuthStatus);

// @route   GET /api/auth/admin/status
// @desc    Check authentication status for admins
// @access  Private/Admin
router.get("/admin/status", protectAdmin, authController.checkAuthStatus);

export default router;
