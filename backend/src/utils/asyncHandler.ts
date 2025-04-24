import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express route handler/middleware to handle rejected promises
 *
 * This eliminates the need for try/catch blocks in each route handler
 * and passes errors to Express's error handling middleware.
 *
 * @param fn Async Express route handler/middleware function
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
