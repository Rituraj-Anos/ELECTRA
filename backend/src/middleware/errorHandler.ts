/**
 * @fileoverview Error Handler Middleware
 * Provides async handler wrapper and global error handler.
 * Sanitizes error details in production to prevent information leakage.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @description Async handler wrapper — eliminates try/catch boilerplate in routes.
 * Wraps async route handlers and forwards any rejected promises to Express error handling.
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped handler with automatic error forwarding
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * @description Global error handler — sanitizes errors in production.
 * Never leaks stack traces or internal details in production environment.
 * @param {Error} err - The caught error
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', err.message);
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
