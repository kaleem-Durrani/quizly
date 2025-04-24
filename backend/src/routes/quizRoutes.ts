import express from "express";
import {
  createQuizValidator,
  updateQuizValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
// import * as quizController from "../controllers/quizController";

const router = express.Router();

// Apply authentication to all quiz routes
router.use(protect);

// Placeholder controller methods - these would be implemented or imported in a real application
const quizController = {
  createQuiz: (req: express.Request, res: express.Response) => {
    res.json({ message: "Create quiz endpoint placeholder" });
  },
  getTeacherQuizzes: (req: express.Request, res: express.Response) => {
    res.json({ message: "Get teacher quizzes endpoint placeholder" });
  },
  getStudentQuizzes: (req: express.Request, res: express.Response) => {
    res.json({ message: "Get student quizzes endpoint placeholder" });
  },
  getQuizById: (req: express.Request, res: express.Response) => {
    res.json({ message: "Get quiz by ID endpoint placeholder" });
  },
  updateQuiz: (req: express.Request, res: express.Response) => {
    res.json({ message: "Update quiz endpoint placeholder" });
  },
  deleteQuiz: (req: express.Request, res: express.Response) => {
    res.json({ message: "Delete quiz endpoint placeholder" });
  },
  publishQuiz: (req: express.Request, res: express.Response) => {
    res.json({ message: "Publish quiz endpoint placeholder" });
  },
  getQuizSubmissions: (req: express.Request, res: express.Response) => {
    res.json({ message: "Get quiz submissions endpoint placeholder" });
  },
  startQuizAttempt: (req: express.Request, res: express.Response) => {
    res.json({ message: "Start quiz attempt endpoint placeholder" });
  },
};

// @route   POST /api/quizzes
// @desc    Create a new quiz for a specific class
// @access  Private/Teacher
router.post(
  "/",
  createQuizValidator,
  validateRequest,
  restrictTo(UserRole.TEACHER),
  quizController.createQuiz
);

// @route   GET /api/quizzes
// @desc    Get all quizzes for a teacher (across all their classes)
// @access  Private/Teacher
router.get(
  "/",
  restrictTo(UserRole.TEACHER),
  paginationWithSearchValidator,
  validateRequest,
  quizController.getTeacherQuizzes
);

// @route   GET /api/quizzes/student
// @desc    Get all available quizzes for a student (across all their classes)
// @access  Private/Student
router.get(
  "/student",
  restrictTo(UserRole.STUDENT),
  paginationWithSearchValidator,
  validateRequest,
  quizController.getStudentQuizzes
);

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID (if teacher owns it or student is in that class)
// @access  Private
router.get("/:id", quizController.getQuizById);

// @route   PUT /api/quizzes/:id
// @desc    Update quiz
// @access  Private/Teacher (if quiz owner)
router.put(
  "/:id",
  updateQuizValidator,
  validateRequest,
  restrictTo(UserRole.TEACHER),
  quizController.updateQuiz
);

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz
// @access  Private/Teacher (if quiz owner)
router.delete("/:id", restrictTo(UserRole.TEACHER), quizController.deleteQuiz);

// @route   PUT /api/quizzes/:id/publish
// @desc    Publish quiz
// @access  Private/Teacher (if quiz owner)
router.put(
  "/:id/publish",
  restrictTo(UserRole.TEACHER),
  quizController.publishQuiz
);

// @route   GET /api/quizzes/:id/submissions
// @desc    Get all submissions for a quiz
// @access  Private/Teacher (if quiz owner)
router.get(
  "/:id/submissions",
  restrictTo(UserRole.TEACHER),
  paginationWithSearchValidator,
  validateRequest,
  quizController.getQuizSubmissions
);

// @route   POST /api/quizzes/:id/start
// @desc    Start a quiz attempt
// @access  Private/Student
router.post(
  "/:id/start",
  restrictTo(UserRole.STUDENT),
  quizController.startQuizAttempt
);

export default router;
