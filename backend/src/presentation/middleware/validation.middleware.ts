import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../../domain/errors/errors';

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Zod schema
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validate request body against schema
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors into readable messages
                const messages = error.issues.map((e: any) =>
                    `${e.path.join('.')}: ${e.message}`
                ).join(', ');
                next(new ValidationError(messages));
            } else {
                next(error);
            }
        }
    };
};
