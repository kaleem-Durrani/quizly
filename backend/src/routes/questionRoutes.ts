import express from "express";
import {
  updateQuestionValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import { questionController } from "../controllers";

const router = express.Router();

// Apply teacher protection to all question routes
router.use(protect);
router.use(restrictTo(UserRole.TEACHER));

// Note: Single question creation is handled by the batch question API
// Use /api/quizzes/:id/questions/batch with a single question in the array

// @route   GET /api/questions
// @desc    Get all questions (optionally filtered by quizId)
// @access  Private/Teacher
router.get(
  "/",
  paginationWithSearchValidator,
  validateRequest,
  questionController.getQuestions
);

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Private/Teacher
router.get("/:id", questionController.getQuestionById);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private/Teacher
router.put(
  "/:id",
  updateQuestionValidator,
  validateRequest,
  questionController.updateQuestion
);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private/Teacher
router.delete("/:id", questionController.deleteQuestion);

// @route   PUT /api/questions/reorder
// @desc    Reorder questions
// @access  Private/Teacher
router.put("/reorder", questionController.reorderQuestions);

export default router;
