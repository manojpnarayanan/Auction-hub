import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/errors';

/**
 * Global error handler middleware
 * Catches all errors and returns consistent JSON responses
 * Should be registered last in middleware chain
 * 
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param next - Next function (required for Express error handlers)
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Handle custom application errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    // Log unexpected errors for debugging
    console.error('Unexpected error:', err);

    // Return generic error for unexpected errors (don't expose internals)
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};
