import express, { Request, Response } from "express";
import {
  createQuestionValidator,
  updateQuestionValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole, APIResponse } from "../constants";

const router = express.Router();

// Apply teacher protection to all question routes
router.use(protect);
router.use(restrictTo(UserRole.TEACHER));

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private/Teacher
router.post(
  "/",
  createQuestionValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: "Create question route",
    };
    res.json(response);
  }
);

// @route   GET /api/questions
// @desc    Get all questions (optionally filtered by quizId)
// @access  Private/Teacher
router.get(
  "/",
  paginationWithSearchValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const quizId = req.query.quizId;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const response: APIResponse = {
      success: true,
      message: quizId
        ? `Get questions for quiz: ${quizId}`
        : "Get all questions",
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 0, // Would be populated with actual count in a real implementation
        pages: 0, // Would be calculated based on total/limit
      },
    };
    res.json(response);
  }
);

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Private/Teacher
router.get("/:id", (req: Request, res: Response) => {
  const response: APIResponse = {
    success: true,
    message: `Get question route for ID: ${req.params.id}`,
  };
  res.json(response);
});

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private/Teacher
router.put(
  "/:id",
  updateQuestionValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: `Update question route for ID: ${req.params.id}`,
    };
    res.json(response);
  }
);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private/Teacher
router.delete("/:id", (req: Request, res: Response) => {
  const response: APIResponse = {
    success: true,
    message: `Delete question route for ID: ${req.params.id}`,
  };
  res.json(response);
});

// @route   PUT /api/questions/reorder
// @desc    Reorder questions
// @access  Private/Teacher
router.put("/reorder", (req: Request, res: Response) => {
  const response: APIResponse = {
    success: true,
    message: "Reorder questions route",
  };
  res.json(response);
});

export default router;
