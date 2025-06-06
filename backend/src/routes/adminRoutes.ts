import express from "express";
import {
  validateRequest,
  paginationWithSearchValidator,
  adminValidators,
} from "../middleware/validators";
import { protectAdmin } from "../middleware/auth";
import { adminController } from "../controllers";

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get("/dashboard", protectAdmin, adminController.getDashboard);

// STUDENT ROUTES

// @route   GET /api/admin/students
// @desc    Get all students for admin
// @access  Private/Admin
router.get(
  "/students",
  protectAdmin,
  paginationWithSearchValidator,
  validateRequest,
  adminController.getStudents
);

// @route   PUT /api/admin/students/:id
// @desc    Update a student (admin only)
// @access  Private/Admin
router.put(
  "/students/:id",
  protectAdmin,
  adminValidators.updateStudentValidator,
  validateRequest,
  adminController.updateStudent
);

// @route   DELETE /api/admin/students/:id
// @desc    Delete a student (admin only)
// @access  Private/Admin
router.delete(
  "/students/:id",
  protectAdmin,
  adminValidators.deleteStudentValidator,
  validateRequest,
  adminController.deleteStudent
);

// TEACHER ROUTES

// @route   GET /api/admin/teachers
// @desc    Get all teachers for admin
// @access  Private/Admin
router.get(
  "/teachers",
  protectAdmin,
  paginationWithSearchValidator,
  validateRequest,
  adminController.getTeachers
);

// @route   POST /api/admin/teachers
// @desc    Create a new teacher account
// @access  Private/Admin
router.post(
  "/teachers",
  protectAdmin,
  adminValidators.createTeacherValidator,
  validateRequest,
  adminController.createTeacher
);

// @route   PUT /api/admin/teachers/:id
// @desc    Update a teacher (admin only)
// @access  Private/Admin
router.put(
  "/teachers/:id",
  protectAdmin,
  adminValidators.updateTeacherValidator,
  validateRequest,
  adminController.updateTeacher
);

// @route   DELETE /api/admin/teachers/:id
// @desc    Delete a teacher (admin only)
// @access  Private/Admin
router.delete(
  "/teachers/:id",
  protectAdmin,
  adminValidators.deleteTeacherValidator,
  validateRequest,
  adminController.deleteTeacher
);

// @route   POST /api/admin/teachers/:id/reset-password
// @desc    Reset a teacher's password
// @access  Private/Admin
router.post(
  "/teachers/:id/reset-password",
  protectAdmin,
  adminValidators.resetTeacherPasswordValidator,
  validateRequest,
  adminController.resetTeacherPassword
);

// ADMIN ROUTES

// @route   POST /api/admin/admins
// @desc    Create a new admin account
// @access  Private/Admin
router.post(
  "/admins",
  protectAdmin,
  adminValidators.createAdminValidator,
  validateRequest,
  adminController.createAdmin
);

// @route   POST /api/admin/change-password
// @desc    Change admin password
// @access  Private/Admin
router.post(
  "/change-password",
  protectAdmin,
  adminValidators.changePasswordValidator,
  validateRequest,
  adminController.changeAdminPassword
);

// QUIZ ROUTES

// @route   GET /api/admin/quizzes
// @desc    Get all quizzes for admin
// @access  Private/Admin
router.get(
  "/quizzes",
  protectAdmin,
  paginationWithSearchValidator,
  validateRequest,
  adminController.getQuizzes
);

export default router;
