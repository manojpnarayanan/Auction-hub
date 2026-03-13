import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/Global/Logger';
import mongoose from 'mongoose';
import { AppError } from '../../domain/errors/errors';
import { HttpStatus } from '../Enums/StatusCodes';


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
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

    logger.error({ err }, 'Unexpected error:');

    res.status(HttpStatus.INERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error'
    });
};
