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

// Import all validators
import * as studentValidators from "./studentValidators";
import * as teacherValidators from "./teacherValidators";
import * as classValidators from "./classValidators";
import * as quizValidators from "./quizValidators";
import * as questionValidators from "./questionValidators";
import * as submissionValidators from "./submissionValidators";
import * as adminValidators from "./adminValidators";
import * as paginationValidators from "./paginationValidators";
import * as subjectValidators from "./subjectValidators";
import * as batchQuestionValidators from "./batchQuestionValidators";

// Export all validators with namespace to avoid conflicts
export {
  studentValidators,
  teacherValidators,
  classValidators,
  quizValidators,
  questionValidators,
  submissionValidators,
  adminValidators,
  paginationValidators,
  subjectValidators,
  batchQuestionValidators,
};

// Export common validators directly for convenience
export const {
  createQuizValidator,
  updateQuizValidator,
} = quizValidators;

export const {
  createQuestionValidator,
  updateQuestionValidator,
} = questionValidators;

export const {
  createClassValidator,
  updateClassValidator,
  regenerateJoinCodeValidator,
  removeStudentValidator,
} = classValidators;

export const {
  createSubjectValidator,
  updateSubjectValidator,
} = subjectValidators;

export const {
  paginationValidator,
  paginationWithSearchValidator,
} = paginationValidators;

export const {
  batchQuestionsValidator,
  createQuizWithQuestionsValidator,
} = batchQuestionValidators;

// Temporary compatibility exports
export {
  studentRegisterValidator as registerValidator,
  studentLoginValidator as loginValidator,
} from "./studentValidators";
