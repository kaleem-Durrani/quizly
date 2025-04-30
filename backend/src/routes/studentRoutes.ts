import express from "express";
import {
  validateRequest,
  paginationWithSearchValidator,
  studentValidators,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import { studentController } from "../controllers";

const router = express.Router();

// @route   GET /api/students/profile
// @desc    Get student profile
// @access  Private/Student
router.get(
  "/profile",
  protect,
  restrictTo(UserRole.STUDENT),
  studentController.getStudentProfile
);

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private/Student
router.put(
  "/profile",
  protect,
  restrictTo(UserRole.STUDENT),
  studentController.updateStudentProfile
);

// @route   POST /api/students/join-class
// @desc    Join a class using the join code
// @access  Private/Student
router.post(
  "/join-class",
  protect,
  restrictTo(UserRole.STUDENT),
  studentValidators.joinClassValidator,
  validateRequest,
  studentController.joinClass
);

// @route   GET /api/students/classes
// @desc    Get all classes the student is enrolled in
// @access  Private/Student
router.get(
  "/classes",
  protect,
  restrictTo(UserRole.STUDENT),
  paginationWithSearchValidator,
  validateRequest,
  studentController.getStudentClasses
);

export default router;
