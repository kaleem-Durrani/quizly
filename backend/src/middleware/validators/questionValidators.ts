import { body } from "express-validator";
import { QuestionType } from "../../constants";

export const createQuestionValidator = [
  body("quizId")
    .notEmpty()
    .withMessage("Quiz ID is required")
    .isMongoId()
    .withMessage("Quiz ID must be a valid ID"),
  body("questionText").notEmpty().withMessage("Question text is required"),
  body("questionType")
    .notEmpty()
    .withMessage("Question type is required")
    .isIn([QuestionType.MCQ, QuestionType.WRITTEN])
    .withMessage("Question type must be either MCQ or written"),
  body("options")
    .if(body("questionType").equals(QuestionType.MCQ))
    .isArray({ min: 2 })
    .withMessage("MCQ questions must have at least 2 options"),
  body("options.*.text")
    .if(body("questionType").equals(QuestionType.MCQ))
    .notEmpty()
    .withMessage("Option text is required"),
  body("options.*.isCorrect")
    .if(body("questionType").equals(QuestionType.MCQ))
    .isBoolean()
    .withMessage("Option correctness must be a boolean"),
  body("options")
    .if(body("questionType").equals(QuestionType.MCQ))
    .custom((options) => {
      const hasCorrectOption = options.some(
        (option: any) => option.isCorrect === true
      );
      if (!hasCorrectOption) {
        throw new Error("At least one option must be marked as correct");
      }
      return true;
    }),
  body("sampleAnswer")
    .if(body("questionType").equals(QuestionType.WRITTEN))
    .notEmpty()
    .withMessage("Sample answer is required for written questions"),
  body("points")
    .optional()
    .isNumeric()
    .withMessage("Points must be a number")
    .isInt({ min: 1 })
    .withMessage("Points must be at least 1"),
  body("orderIndex")
    .notEmpty()
    .withMessage("Order index is required")
    .isNumeric()
    .withMessage("Order index must be a number"),
];

export const updateQuestionValidator = [
  body("questionText")
    .optional()
    .notEmpty()
    .withMessage("Question text is required if provided"),
  body("questionType")
    .optional()
    .isIn([QuestionType.MCQ, QuestionType.WRITTEN])
    .withMessage("Question type must be either MCQ or written"),
  body("options")
    .if(body("questionType").equals(QuestionType.MCQ))
    .isArray({ min: 2 })
    .withMessage("MCQ questions must have at least 2 options"),
  body("options.*.text")
    .if(body("questionType").equals(QuestionType.MCQ))
    .notEmpty()
    .withMessage("Option text is required"),
  body("options.*.isCorrect")
    .if(body("questionType").equals(QuestionType.MCQ))
    .isBoolean()
    .withMessage("Option correctness must be a boolean"),
  body("options")
    .if(body("questionType").equals(QuestionType.MCQ))
    .custom((options) => {
      const hasCorrectOption = options.some(
        (option: any) => option.isCorrect === true
      );
      if (!hasCorrectOption) {
        throw new Error("At least one option must be marked as correct");
      }
      return true;
    }),
  body("sampleAnswer")
    .if(body("questionType").equals(QuestionType.WRITTEN))
    .notEmpty()
    .withMessage("Sample answer is required for written questions"),
  body("points")
    .optional()
    .isNumeric()
    .withMessage("Points must be a number")
    .isInt({ min: 1 })
    .withMessage("Points must be at least 1"),
  body("orderIndex")
    .optional()
    .isNumeric()
    .withMessage("Order index must be a number"),
];
