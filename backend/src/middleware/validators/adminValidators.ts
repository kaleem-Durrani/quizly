import { body, query, param } from "express-validator";

/**
 * Validator for admin login
 */
export const adminLoginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validator for updating a student (admin)
 */
export const updateStudentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID format"),
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

/**
 * Validator for updating a teacher (admin)
 */
export const updateTeacherValidator = [
  param("id")
    .notEmpty()
    .withMessage("Teacher ID is required")
    .isMongoId()
    .withMessage("Invalid teacher ID format"),
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("isBanned")
    .optional()
    .isBoolean()
    .withMessage("isBanned field must be a boolean"),
];

/**
 * Validator for deleting a student
 */
export const deleteStudentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID format"),
];

/**
 * Validator for deleting a teacher
 */
export const deleteTeacherValidator = [
  param("id")
    .notEmpty()
    .withMessage("Teacher ID is required")
    .isMongoId()
    .withMessage("Invalid teacher ID format"),
];

// Keep the original validators for backward compatibility
export const updateUserValidator = updateStudentValidator;
export const deleteUserValidator = deleteStudentValidator;
