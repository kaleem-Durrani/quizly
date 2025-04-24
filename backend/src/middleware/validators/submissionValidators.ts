import { body } from "express-validator";

export const createSubmissionValidator = [
  body("quizId")
    .notEmpty()
    .withMessage("Quiz ID is required")
    .isMongoId()
    .withMessage("Quiz ID must be a valid ID"),
];

export const submitAnswerValidator = [
  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isMongoId()
    .withMessage("Question ID must be a valid ID"),
  body("selectedOptions")
    .optional()
    .isArray()
    .withMessage("Selected options must be an array"),
  body("writtenAnswer")
    .optional()
    .isString()
    .withMessage("Written answer must be a string"),
];

export const completeSubmissionValidator = [
  body("submittedAt")
    .optional()
    .isISO8601()
    .withMessage("Submitted at must be a valid date"),
];

export const gradeSubmissionValidator = [
  body("answers").isArray().withMessage("Answers must be an array"),
  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isMongoId()
    .withMessage("Question ID must be a valid ID"),
  body("answers.*.score")
    .notEmpty()
    .withMessage("Score is required")
    .isNumeric()
    .withMessage("Score must be a number")
    .isInt({ min: 0 })
    .withMessage("Score must be at least 0"),
  body("answers.*.feedback")
    .optional()
    .isString()
    .withMessage("Feedback must be a string"),
  body("totalScore")
    .notEmpty()
    .withMessage("Total score is required")
    .isNumeric()
    .withMessage("Total score must be a number")
    .isInt({ min: 0 })
    .withMessage("Total score must be at least 0"),
];
