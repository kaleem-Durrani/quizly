import { body, param } from "express-validator";
import { QuestionType } from "../../constants";

/**
 * Validator for adding batch questions to a quiz
 */
export const batchQuestionsValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid quiz ID format"),
  
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  
  body("questions.*.questionText")
    .notEmpty()
    .withMessage("Question text is required"),
  
  body("questions.*.questionType")
    .notEmpty()
    .withMessage("Question type is required")
    .isIn([QuestionType.MCQ, QuestionType.WRITTEN])
    .withMessage("Question type must be either MCQ or written"),
  
  body("questions.*.options")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .isArray({ min: 2 })
    .withMessage("MCQ questions must have at least 2 options"),
  
  body("questions.*.options.*.text")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .notEmpty()
    .withMessage("Option text is required"),
  
  body("questions.*.options.*.isCorrect")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .isBoolean()
    .withMessage("Option correctness must be a boolean"),
  
  body("questions.*.options")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .custom((options) => {
      const hasCorrectOption = options.some(
        (option: any) => option.isCorrect === true
      );
      if (!hasCorrectOption) {
        throw new Error("At least one option must be marked as correct");
      }
      return true;
    }),
  
  body("questions.*.sampleAnswer")
    .if(body("questions.*.questionType").equals(QuestionType.WRITTEN))
    .notEmpty()
    .withMessage("Sample answer is required for written questions"),
  
  body("questions.*.points")
    .optional()
    .isNumeric()
    .withMessage("Points must be a number")
    .isInt({ min: 1 })
    .withMessage("Points must be at least 1"),
  
  body("questions.*.orderIndex")
    .optional()
    .isNumeric()
    .withMessage("Order index must be a number"),
];

/**
 * Validator for creating a quiz with questions
 */
export const createQuizWithQuestionsValidator = [
  body("quiz.title")
    .notEmpty()
    .withMessage("Quiz title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Quiz title must be between 3 and 100 characters"),
  
  body("quiz.description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Quiz description cannot exceed 500 characters"),
  
  body("quiz.classId")
    .notEmpty()
    .withMessage("Class ID is required")
    .isMongoId()
    .withMessage("Class ID must be a valid ID"),
  
  body("quiz.timeLimit")
    .optional()
    .isNumeric()
    .withMessage("Time limit must be a number")
    .isInt({ min: 1, max: 180 })
    .withMessage("Time limit must be between 1 and 180 minutes"),
  
  body("quiz.availableFrom")
    .optional()
    .isISO8601()
    .withMessage("Available from date must be a valid date"),
  
  body("quiz.availableTo")
    .optional()
    .isISO8601()
    .withMessage("Available to date must be a valid date")
    .custom((value, { req }) => {
      if (
        req.body.quiz.availableFrom &&
        new Date(value) <= new Date(req.body.quiz.availableFrom)
      ) {
        throw new Error("Available to date must be after available from date");
      }
      return true;
    }),
  
  body("questions")
    .optional()
    .isArray()
    .withMessage("Questions must be an array"),
  
  body("questions.*.questionText")
    .if(body("questions").exists())
    .notEmpty()
    .withMessage("Question text is required"),
  
  body("questions.*.questionType")
    .if(body("questions").exists())
    .notEmpty()
    .withMessage("Question type is required")
    .isIn([QuestionType.MCQ, QuestionType.WRITTEN])
    .withMessage("Question type must be either MCQ or written"),
  
  body("questions.*.options")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .isArray({ min: 2 })
    .withMessage("MCQ questions must have at least 2 options"),
  
  body("questions.*.options.*.text")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .notEmpty()
    .withMessage("Option text is required"),
  
  body("questions.*.options.*.isCorrect")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .isBoolean()
    .withMessage("Option correctness must be a boolean"),
  
  body("questions.*.options")
    .if(body("questions.*.questionType").equals(QuestionType.MCQ))
    .custom((options) => {
      const hasCorrectOption = options.some(
        (option: any) => option.isCorrect === true
      );
      if (!hasCorrectOption) {
        throw new Error("At least one option must be marked as correct");
      }
      return true;
    }),
  
  body("questions.*.sampleAnswer")
    .if(body("questions.*.questionType").equals(QuestionType.WRITTEN))
    .notEmpty()
    .withMessage("Sample answer is required for written questions"),
  
  body("questions.*.points")
    .optional()
    .isNumeric()
    .withMessage("Points must be a number")
    .isInt({ min: 1 })
    .withMessage("Points must be at least 1"),
];
