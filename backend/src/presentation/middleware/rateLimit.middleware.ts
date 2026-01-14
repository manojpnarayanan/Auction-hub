import { Request, Response, NextFunction } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { AppError } from "../../domain/errors/errors";


export const rateLimit = (limit: number, windowSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cacheService = container.get<ICacheService>(TYPES.CacheService);
            const ip = req.ip || "unknown";
            const key = `ratelimit:${ip}:${req.path}`
            const current = await cacheService.get(key);
            const count = current ? parseInt(current) : 0
            if (count >= limit) {
                throw new Error("Too many request, Please try again")
            }
            await cacheService.set(key, (count + 1).toString(), windowSeconds);
            next();
        } catch (error) {
            next(error)
        }
    }
}