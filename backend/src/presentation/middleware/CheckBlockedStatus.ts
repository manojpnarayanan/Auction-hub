import { Request, Response, NextFunction } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";



export const checkBlockedStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId=(req as any).user?.userId || (req as any).user?._id;
        const userId = (req as any).user?.userId || (req as any).user?._id || (req as any).user?.id;
        if (!userId) {
            // return res.status(401).json({messgae:"Unauthorized"});
            // console.log("No User ID -> Treating as Guest");
            return next();
        }
        const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

        const user = await userRepository.findById(userId);
        if (user && user.isBlocked) {
            return res.status(403).json({ message: "USer is blocked" });
        }
        next();
    } catch (error) {
        console.error("Block check error", error);
        res.status(500).json({ message: "Server Error" });
    }
}