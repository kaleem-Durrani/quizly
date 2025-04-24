import express, { Request, Response } from "express";
import {
  createSubmissionValidator,
  submitAnswerValidator,
  completeSubmissionValidator,
  gradeSubmissionValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole, APIResponse } from "../constants";

const router = express.Router();

// Apply protection to all submission routes
router.use(protect);

// @route   POST /api/submissions
// @desc    Start a new submission (for students)
// @access  Private/Student
router.post(
  "/",
  restrictTo(UserRole.STUDENT),
  createSubmissionValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: "Create submission route",
    };
    res.json(response);
  }
);

// @route   PUT /api/submissions/:id/answer
// @desc    Submit an answer for a question
// @access  Private/Student
router.put(
  "/:id/answer",
  restrictTo(UserRole.STUDENT),
  submitAnswerValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: `Submit answer for submission ID: ${req.params.id}`,
    };
    res.json(response);
  }
);

// @route   PUT /api/submissions/:id/complete
// @desc    Complete a submission
// @access  Private/Student
router.put(
  "/:id/complete",
  restrictTo(UserRole.STUDENT),
  completeSubmissionValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: `Complete submission for ID: ${req.params.id}`,
    };
    res.json(response);
  }
);

// @route   GET /api/submissions
// @desc    Get submissions (filtered by student for students, all for teachers)
// @access  Private
router.get(
  "/",
  paginationWithSearchValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const studentId = req.query.studentId;
    const quizId = req.query.quizId;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let message = "Get all submissions";
    if (studentId) message += ` for student: ${studentId}`;
    if (quizId) message += ` for quiz: ${quizId}`;

    const response: APIResponse = {
      success: true,
      message,
      data: {
        submissions: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0,
        },
      },
    };
    res.json(response);
  }
);

// @route   GET /api/submissions/:id
// @desc    Get submission by ID
// @access  Private
router.get("/:id", (req: Request, res: Response) => {
  const response: APIResponse = {
    success: true,
    message: `Get submission for ID: ${req.params.id}`,
  };
  res.json(response);
});

// @route   PUT /api/submissions/:id/grade
// @desc    Grade a submission (for teachers)
// @access  Private/Teacher
router.put(
  "/:id/grade",
  restrictTo(UserRole.TEACHER),
  gradeSubmissionValidator,
  validateRequest,
  (req: Request, res: Response) => {
    const response: APIResponse = {
      success: true,
      message: `Grade submission for ID: ${req.params.id}`,
    };
    res.json(response);
  }
);

export default router;
