import express from "express";
import {
  createQuizValidator,
  updateQuizValidator,
  validateRequest,
  paginationWithSearchValidator,
} from "../middleware/validators";
import { protect, restrictTo } from "../middleware/auth";
import { UserRole } from "../constants";
import { quizController } from "../controllers";

const router = express.Router();

// Apply authentication to all quiz routes
router.use(protect);

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

// @route   POST /api/quizzes/with-questions
// @desc    Create a new quiz with questions in one request
// @access  Private/Teacher
router.post(
  "/with-questions",
  restrictTo(UserRole.TEACHER),
  quizController.createQuizWithQuestions
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

// @route   POST /api/quizzes/:id/questions/batch
// @desc    Add multiple questions to a quiz in one request
// @access  Private/Teacher (if quiz owner)
router.post(
  "/:id/questions/batch",
  restrictTo(UserRole.TEACHER),
  quizController.addQuestionsBatch
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
