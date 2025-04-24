import { body, param } from "express-validator";

/**
 * Validator for creating a new subject
 */
export const createSubjectValidator = [
  body("name")
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Subject name must be between 2 and 50 characters")
    .trim(),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

/**
 * Validator for updating a subject
 */
export const updateSubjectValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid subject ID format"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Subject name must be between 2 and 50 characters")
    .trim(),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .trim(),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
