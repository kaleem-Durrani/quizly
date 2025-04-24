import express from "express";
import {
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import { teacherController } from "../controllers";

const router = express.Router();

// @route   GET /api/teachers/profile
// @desc    Get teacher profile
// @access  Private/Teacher
router.get(
  "/profile",
  protect,
  restrictTo(UserRole.TEACHER),
  teacherController.getTeacherProfile
);

// @route   PUT /api/teachers/profile
// @desc    Update teacher profile
// @access  Private/Teacher
router.put(
  "/profile",
  protect,
  restrictTo(UserRole.TEACHER),
  teacherController.updateTeacherProfile
);

// @route   GET /api/teachers/classes
// @desc    Get all classes created by the teacher
// @access  Private/Teacher
router.get(
  "/classes",
  protect,
  restrictTo(UserRole.TEACHER),
  paginationWithSearchValidator,
  validateRequest,
  teacherController.getTeacherClasses
);

export default router;
