import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../../domain/errors/errors';
import { HttpStatus } from '../Enums/StatusCodes';


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if(err instanceof mongoose.Error.ValidationError){
        res.status(HttpStatus.BAD_REQUEST).json({success:false,message:err.message});
        return;
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    console.error('Unexpected error:', err);

    res.status(HttpStatus.INERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
    });
};
