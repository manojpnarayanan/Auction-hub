import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/Global/Logger';

export const pinoerrorHandler = (err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {  
    logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
