import express from "express";
import {
  validateRequest,
  createClassValidator,
  updateClassValidator,
  regenerateJoinCodeValidator,
  removeStudentValidator,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import { classController } from "../controllers";

const router = express.Router();

// Apply authentication to all class routes
router.use(protect);

// @route   POST /api/classes
// @desc    Create a new class
// @access  Private/Teacher
router.post(
  "/",
  createClassValidator,
  validateRequest,
  restrictTo(UserRole.TEACHER),
  classController.createClass
);

// @route   GET /api/classes
// @desc    Get all classes (teacher sees their own classes, students see enrolled classes)
// @access  Private/Teacher or Student
router.get(
  "/",
  paginationWithSearchValidator,
  validateRequest,
  classController.getClasses
);

// @route   GET /api/classes/:id
// @desc    Get class by ID
// @access  Private/Teacher or Student (if enrolled)
router.get("/:id", classController.getClassById);

// @route   PUT /api/classes/:id
// @desc    Update class
// @access  Private/Teacher (if class owner)
router.put(
  "/:id",
  restrictTo(UserRole.TEACHER),
  updateClassValidator,
  validateRequest,
  classController.updateClass
);

// @route   DELETE /api/classes/:id
// @desc    Delete class
// @access  Private/Teacher (if class owner)
router.delete(
  "/:id",
  restrictTo(UserRole.TEACHER),
  classController.deleteClass
);

// @route   POST /api/classes/:id/regenerate-code
// @desc    Regenerate class join code
// @access  Private/Teacher (if class owner)
router.post(
  "/:id/regenerate-code",
  restrictTo(UserRole.TEACHER),
  regenerateJoinCodeValidator,
  validateRequest,
  classController.regenerateJoinCode
);

// @route   GET /api/classes/:id/students
// @desc    Get all students in class
// @access  Private/Teacher (if class owner)
router.get(
  "/:id/students",
  restrictTo(UserRole.TEACHER),
  paginationWithSearchValidator,
  validateRequest,
  classController.getClassStudents
);

// @route   DELETE /api/classes/:id/students/:studentId
// @desc    Remove student from class
// @access  Private/Teacher (if class owner)
router.delete(
  "/:id/students/:studentId",
  restrictTo(UserRole.TEACHER),
  removeStudentValidator,
  validateRequest,
  classController.removeStudentFromClass
);

// @route   GET /api/classes/:id/quizzes
// @desc    Get all quizzes in class
// @access  Private/Teacher or Student (if enrolled)
router.get(
  "/:id/quizzes",
  paginationWithSearchValidator,
  validateRequest,
  classController.getClassQuizzes
);

export default router;
