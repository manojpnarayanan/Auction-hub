import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";

import { SignupUseCase } from "../../application/use-cases/SignupUseCase";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUseCase";
// import { EmailService } from "../../infrastructure/email/EmailService";
// import { IUserRepository } from "../../domain/interfaces/IUserRepository";
// import { NotFoundError, ValidationError } from "../../domain/errors/errors";
import { IVerifyOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { IForgotPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";


@injectable()

export class AuthController {
    constructor(
        @inject(TYPES.SignupUseCase) private signupUseCase: SignupUseCase,
        @inject(TYPES.LoginUseCase) private loginUsecase: LoginUseCase,
        @inject(TYPES.RefreshTokenUseCase) private refreshTokenUseCase: RefreshTokenUseCase,
        // @inject(TYPES.EmailService) private emailService: EmailService,
        // @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject (TYPES.verifyOtpUseCase)private verifyOtpUseCase:IVerifyOtpUseCase,
        @inject(TYPES.ResetPasswordUseCase) private resetPasswordUSeCase:IResetPasswordUseCase,
        @inject(TYPES.ForgotPasswordUseCase) private forgotPasswordUseCase:IForgotPasswordUseCase,

    ) { }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.signupUseCase.execute(req.body);
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.loginUsecase.execute(req.body);
            res.status(200).json({ success: true, ...result });
        } catch (error) { next(error) }
    }
    googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = req.user as any;
            const frontendUrl = `${process.env.CORS_ORIGIN}/auth/callback?token=${result.token}&isNewUser=${result.isNewUser}`;
            res.redirect(frontendUrl);
        } catch (error) {
            next(error);
        }
    }
    googleAuthFailure = (req: Request, res: Response) => {
        res.redirect(`${process.env.CORS_ORGIN}/login>error=google_auth_failed`)
    }
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ success: false, message: "Refresh token required" });
                return;
            }
            const accessToken = await this.refreshTokenUseCase.execute(refreshToken);
            res.status(200).json({ success: true, accessToken });
        } catch (error) {
            console.error("Signup failed", error);
            next(error);
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this.verifyOtpUseCase.execute(email,otp);
            res.status(200).json({ success: true, message: "Verified" });
        } catch (error) {
            next(error);
        }
    }
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this.forgotPasswordUseCase.execute(email);
            res.status(200).json({ success: true, message: "OTP sent to mail" });
        } catch (error) {
            next(error);
        }
    }
    resetPassword= async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {email,otp,newPassword} =req.body;
            await this.resetPasswordUSeCase.execute(email,otp,newPassword);
            res.status(200).json({success:true,message:"Password changed successfully"});
        }catch(error){
        next(error);
    }
    }
}