/**
 * Custom Error Classes
 * Provides better error handling with HTTP status code mapping
 */

/**
 * Base application error class
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 - Resource not found
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * 409 - Resource already exists (conflict)
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
    }
}

/**
 * 401 - Unauthorized (invalid credentials)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Invalid credentials') {
        super(message, 401);
    }
}

/**
 * 400 - Validation error
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 400);
    }
}

/**
 * 403 - Forbidden (authenticated but not authorized)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403);
    }
}
