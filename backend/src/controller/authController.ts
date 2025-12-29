
import type { Request, Response, NextFunction } from "express";
import { IAuthService } from "../domain/interfaces/IAuthService";
import { CreateUserDTO, LoginDTO } from "../application/dtos/user.dto";
import { injectable ,inject } from "inversify";
import {TYPES} from "../di/types"


/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 * Following Single Responsibility Principle - only handles HTTP concerns
 */
@injectable() 
export class AuthController {
    constructor(@inject(TYPES.AuthService) private readonly authService:IAuthService) { }

    /**
     * Handle user signup request
     * POST /user/signup
     */
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: CreateUserDTO = req.body;
            const user = await this.authService.signup(userData);

            res.status(201).json({
                success: true,
                message: "Signup successful",
                data: user
            });
        } catch (error) {
            next(error); // Pass error to global error handler
        }
    };

    /**
     * Handle user login request
     * POST /user/login
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loginData: LoginDTO = req.body;
            const result = await this.authService.login(loginData);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error); // Pass error to global error handler
        }
    };

    googleAuthCallback=async (req:Request,res:Response , next:NextFunction):Promise<void>=>{
        try{
            const result=req.user as any;
            const frontendUrl=`${process.env.CORS_ORIGIN}/auth/callback?token=${result.token}&isNewUser=${result.isNewUser}`;
            res.redirect(frontendUrl);
        } catch (error) {
            next(error);
        }
        };
        googleAuthFailure = (req: Request, res: Response): void => {
        res.redirect(`${process.env.CORS_ORIGIN}/login?error=google_auth_failed`);
    };
    
}