import { body, param } from "express-validator";

/**
 * Validator for creating a new class
 */
export const createClassValidator = [
  body("name")
    .notEmpty()
    .withMessage("Class name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Class name must be between 3 and 50 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("subject")
    .optional()
    .isString()
    .withMessage("Subject must be a string"),
];

/**
 * Validator for joining a class with a join code
 */
export const joinClassValidator = [
  body("joinCode")
    .notEmpty()
    .withMessage("Join code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Join code must be 6 characters")
    .isAlphanumeric()
    .withMessage("Join code must contain only letters and numbers")
    .isUppercase()
    .withMessage("Join code must be uppercase"),
];

/**
 * Validator for updating a class
 */
export const updateClassValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid class ID format"),
  body("name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Class name must be between 3 and 50 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("subject")
    .optional()
    .isString()
    .withMessage("Subject must be a string"),
];

/**
 * Validator for regenerating a class join code
 */
export const regenerateJoinCodeValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid class ID format"),
];

/**
 * Validator for removing a student from a class
 */
export const removeStudentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid class ID format"),
  param("studentId")
    .isMongoId()
    .withMessage("Invalid student ID format"),
];
