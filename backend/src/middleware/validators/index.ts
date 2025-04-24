import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../../utils/customErrors";

/**
 * Middleware to validate request data based on express-validator rules
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors as { field: [error messages] }
    const formattedErrors = errors
      .array()
      .reduce((acc: { [key: string]: string[] }, error: any) => {
        const field = error.param;
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(error.msg);
        return acc;
      }, {});

    throw new ValidationError(formattedErrors);
  }

  next();
};

// Export all validators
export * from "./studentValidators";
export * from "./teacherValidators";
export * from "./classValidators";
export * from "./quizValidators";
export * from "./questionValidators";
export * from "./submissionValidators";
export * from "./adminValidators";
export * from "./paginationValidators";
export * from "./subjectValidators";

// Re-export with explicit names to resolve conflicts
export { joinClassValidator as studentJoinClassValidator } from "./studentValidators";
export { updateClassValidator as teacherUpdateClassValidator } from "./teacherValidators";

// Temporary compatibility exports
export {
  studentRegisterValidator as registerValidator,
  studentLoginValidator as loginValidator,
} from "./studentValidators";
