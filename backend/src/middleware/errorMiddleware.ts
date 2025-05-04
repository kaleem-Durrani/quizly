import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
} from "../utils/customErrors";

/**
 * Handle 404 errors for routes that don't exist
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler for the application
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let response: any = {
    success: false,
    message: err.message,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  // Handle custom errors
  if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    response.errors = err.errors;
  } else if (
    err instanceof AuthenticationError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError
  ) {
    statusCode = err.statusCode;
    response.errors = {
      _error: [err.message],
    };
  } else if (err.name === "CastError" && err.kind === "ObjectId") {
    // Handle Mongoose cast errors
    statusCode = 400;
    response.message = "Resource not found";
  } else if (err.code === 11000) {
    // Handle Mongoose duplicate key errors
    statusCode = 400;
    response.message = "Duplicate field value entered";
  } else if (err.name === "ValidationError") {
    // Handle Mongoose validation errors
    statusCode = 400;
    response.errors = Object.values(err.errors).reduce(
      (acc: any, error: any) => {
        const field = error.path;
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(error.message);
        return acc;
      },
      {}
    );
  } else if (err.name === "JsonWebTokenError") {
    // Handle JWT errors
    statusCode = 401;
    response.message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    // Handle JWT expiration
    statusCode = 401;
    response.message = "Token expired";
  }

  console.log(err);

  res.status(statusCode).json(response);
};
