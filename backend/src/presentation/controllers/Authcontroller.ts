import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { HttpStatus } from "../Enums/StatusCodes"
import { CustomMessages } from "../Enums/CustomMessages";

import { ILoginUseCase } from "../../application/use-cases/Usecase Interfaces/ILoginUseCase";
import { IRefreshTokenUseCase } from "../../application/use-cases/Usecase Interfaces/IRefreshTokenUseCase";
// import { SignupUseCase } from "../../application/use-cases/SignupUseCase";
// import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
// import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUseCase";
import { IVerifyOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { IForgotPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";
import { IResendOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IResendOtpUseCase";
import { ISignupUseCase } from "../../application/use-cases/Usecase Interfaces/ISignupUseCase";
import { ILogoutUseCase } from "../../application/use-cases/Usecase Interfaces/ILogoutUseCase";

@injectable()

export class AuthController {
    constructor(
        @inject(TYPES.SignupUseCase) private signupUseCase: ISignupUseCase,
        @inject(TYPES.LoginUseCase) private loginUsecase: ILoginUseCase,
        @inject(TYPES.RefreshTokenUseCase) private refreshTokenUseCase: IRefreshTokenUseCase,
        @inject(TYPES.verifyOtpUseCase) private verifyOtpUseCase: IVerifyOtpUseCase,
        @inject(TYPES.ResetPasswordUseCase) private resetPasswordUSeCase: IResetPasswordUseCase,
        @inject(TYPES.ForgotPasswordUseCase) private forgotPasswordUseCase: IForgotPasswordUseCase,
        @inject(TYPES.ResendOtpUseCase) private resendOtpUseCase: IResendOtpUseCase,
        @inject(TYPES.LogoutUseCase) private logoutUseCase:ILogoutUseCase,
    
    ) { }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.signupUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.loginUsecase.execute(req.body);
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict',
                maxAge:7*24*60*60*1000
            });
            res.status(HttpStatus.OK).json({ success: true, token:result.token,user:result.user });
        } catch (error) { next(error) }
    }
    googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = req.user as any;
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict',
                maxAge:7*24*60*60*1000
            });
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
            const refreshToken =req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(400).json({ success: false, message: CustomMessages.REFRESH_TOKEN_REQUIRED });
                return;
            }
            const accessToken = await this.refreshTokenUseCase.execute(refreshToken);
            res.status(HttpStatus.OK).json({ success: true, accessToken });
        } catch (error) {
            console.error("Signup failed", error);
            next(error);
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this.verifyOtpUseCase.execute(email, otp);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.VERIFIED });
        } catch (error) {
            next(error);
        }
    }
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this.forgotPasswordUseCase.execute(email);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.OTP_SENT });
        } catch (error) {
            next(error);
        }
    }
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;
            await this.resetPasswordUSeCase.execute(email, otp, newPassword);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.PASSWORD_CHANGED });
        } catch (error) {
            next(error);
        }
    }
    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this.resendOtpUseCase.execute(email);
            res.status(HttpStatus.OK).json({ success: true, message:CustomMessages.OTP_SENT });
        } catch (error) {
            next(error)
        }
    }
    logout=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const token=req.headers.authorization?.split(" ")[1];
            if(!token){
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success:false,message:CustomMessages.NO_TOKEN_PROVIDED
                });
                return;
            }
            await this.logoutUseCase.execute(token);
            res.clearCookie("refreshToken");
            res.status(HttpStatus.OK).json({success:true,message:CustomMessages.LOG_OUT});
        }catch(error){
            next(error);
        }
    }
}