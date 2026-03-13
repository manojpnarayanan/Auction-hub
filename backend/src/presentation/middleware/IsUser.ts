import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";
import { HttpStatus } from "../Enums/StatusCodes";



export const isUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        //     if (authHeader && authHeader.startsWith("Bearer")) {
        //         const token = authHeader.split(" ")[1];
        //         const decoded = jwt.verify(token, config.jwtSecret);
        //         (req as any).user = decoded;
        //     }
        //     next();

        // } catch (error) {
        //     next();
        // }
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded as Express.User;
        next();

    } catch (_error) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token expired or invalid" });
    }

}