import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../../domain/errors/errors';


export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
        
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
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
