import { Request, Response, NextFunction } from "express";
import logger from "../../infrastructure/Global/Logger";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { HttpStatus } from "../Enums/StatusCodes";



export const checkBlockedStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId=(req as any).user?.userId || (req as any).user?._id;
        // const userId = (req as any).user?.userId || (req as any).user?._id || (req as any).user?.id;
        const userId=req.user?.id
        if (!userId) {
            // return res.status(401).json({messgae:"Unauthorized"});
            // logger.info("No User ID -> Treating as Guest");
            return next();
        }
        const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

        const user = await userRepository.findById(userId);
        if (user && user.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: "USer is blocked" });
        }
        next();
    } catch (error) {
        logger.error({ error }, "Block check error");
        res.status(HttpStatus.INERNAL_SERVER_ERROR).json({ message: "Server Error" });
    }
}