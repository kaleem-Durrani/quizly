import { query } from "express-validator";

/**
 * Common validator for pagination parameters
 */
export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("sort").optional().isString().withMessage("Sort must be a string"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'"),
];

/**
 * Validator for search query parameter
 */
export const searchValidator = [
  query("search").optional().isString().withMessage("Search must be a string"),
];

/**
 * Combined validator for pagination with search
 */
export const paginationWithSearchValidator = [
  ...paginationValidator,
  ...searchValidator,
];
