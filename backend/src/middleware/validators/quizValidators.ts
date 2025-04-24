import { body } from "express-validator";

export const createQuizValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("timeLimit")
    .optional()
    .isNumeric()
    .withMessage("Time limit must be a number"),
  body("availableFrom")
    .optional()
    .isISO8601()
    .withMessage("Available from date must be a valid date"),
  body("availableTo")
    .optional()
    .isISO8601()
    .withMessage("Available to date must be a valid date")
    .custom((value, { req }) => {
      if (
        req.body.availableFrom &&
        new Date(value) <= new Date(req.body.availableFrom)
      ) {
        throw new Error("Available to date must be after available from date");
      }
      return true;
    }),
];

export const updateQuizValidator = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("Is published must be a boolean"),
  body("timeLimit")
    .optional()
    .isNumeric()
    .withMessage("Time limit must be a number"),
  body("availableFrom")
    .optional()
    .isISO8601()
    .withMessage("Available from date must be a valid date"),
  body("availableTo")
    .optional()
    .isISO8601()
    .withMessage("Available to date must be a valid date")
    .custom((value, { req }) => {
      if (
        req.body.availableFrom &&
        new Date(value) <= new Date(req.body.availableFrom)
      ) {
        throw new Error("Available to date must be after available from date");
      }
      return true;
    }),
];
