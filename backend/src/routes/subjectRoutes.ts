import express from "express";
import {
  createSubjectValidator,
  updateSubjectValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import * as subjectController from "../controllers/subjectController";

const router = express.Router();

// Apply authentication to all subject routes
router.use(protect);

// @route   POST /api/subjects
// @desc    Create a new subject
// @access  Private/Admin
router.post(
  "/",
  restrictTo(UserRole.ADMIN),
  createSubjectValidator,
  validateRequest,
  subjectController.createSubject
);

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get(
  "/",
  paginationWithSearchValidator,
  validateRequest,
  subjectController.getSubjects
);

// @route   GET /api/subjects/:id
// @desc    Get subject by ID
// @access  Private
router.get("/:id", subjectController.getSubjectById);

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private/Admin
router.put(
  "/:id",
  restrictTo(UserRole.ADMIN),
  updateSubjectValidator,
  validateRequest,
  subjectController.updateSubject
);

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
// @access  Private/Admin
router.delete(
  "/:id",
  restrictTo(UserRole.ADMIN),
  subjectController.deleteSubject
);

export default router;
