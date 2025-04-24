import { body, param, query } from "express-validator";

/**
 * Validator for teacher login
 */
export const teacherLoginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validator for teacher password change
 */
export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

/**
 * Validator for updating teacher profile
 */
export const updateTeacherProfileValidator = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("institution")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Institution name cannot exceed 100 characters"),
];

/**
 * Validator for updating a class
 */
export const updateClassValidator = [
  param("classId").isMongoId().withMessage("Invalid class ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Class name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("subject")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Subject cannot exceed 50 characters"),

  body("grade")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Grade cannot exceed 20 characters"),
];

/**
 * Validator for getting a class by ID
 */
export const getClassByIdValidator = [
  param("classId").isMongoId().withMessage("Invalid class ID format"),
];

/**
 * Validator for deleting a class
 */
export const deleteClassValidator = [
  param("classId").isMongoId().withMessage("Invalid class ID format"),
];

/**
 * Validator for getting teacher classes with pagination
 */
export const getTeacherClassesValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50")
    .toInt(),
];
