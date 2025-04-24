import { body } from "express-validator";

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
];
