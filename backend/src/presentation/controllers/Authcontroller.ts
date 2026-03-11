import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { HttpStatus } from "../Enums/StatusCodes"
import { CustomMessages } from "../Enums/CustomMessages";
import { OAuthResponseDTO } from "../../application/dtos/user.dto";
import { ILoginUseCase } from "../../application/use-cases/Usecase Interfaces/ILoginUseCase";
import { IRefreshTokenUseCase } from "../../application/use-cases/Usecase Interfaces/IRefreshTokenUseCase";
import { IVerifyOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { IForgotPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";
import { IResendOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IResendOtpUseCase";
import { ISignupUseCase } from "../../application/use-cases/Usecase Interfaces/ISignupUseCase";
import { ILogoutUseCase } from "../../application/use-cases/Usecase Interfaces/ILogoutUseCase";
import { IGoogleAuthUseCase } from "../../application/use-cases/Usecase Interfaces/IGoogleAuthUseCase";

@injectable()

export class AuthController {
    constructor(
        @inject(TYPES.SignupUseCase) private _signupUseCase: ISignupUseCase,
        @inject(TYPES.LoginUseCase) private _loginUsecase: ILoginUseCase,
        @inject(TYPES.RefreshTokenUseCase) private _refreshTokenUseCase: IRefreshTokenUseCase,
        @inject(TYPES.verifyOtpUseCase) private _verifyOtpUseCase: IVerifyOtpUseCase,
        @inject(TYPES.ResetPasswordUseCase) private _resetPasswordUSeCase: IResetPasswordUseCase,
        @inject(TYPES.ForgotPasswordUseCase) private _forgotPasswordUseCase: IForgotPasswordUseCase,
        @inject(TYPES.ResendOtpUseCase) private _resendOtpUseCase: IResendOtpUseCase,
        @inject(TYPES.LogoutUseCase) private _logoutUseCase: ILogoutUseCase,
        @inject(TYPES.GoogleAuthUseCase) private _googleAuthUseCase:IGoogleAuthUseCase

    ) { }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log(req.body);
            const result = await this._signupUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._loginUsecase.execute(req.body);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                // maxAge: 7 * 24 * 60 * 60 * 1000
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE)
            });
            res.status(HttpStatus.OK).json({ success: true, token: result.token, user: result.user });
        } catch (error) { next(error) }
    }
    // googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const result = req.user as unknown as OAuthResponseDTO;
    //         res.cookie('refreshToken', result.refreshToken, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             sameSite: 'strict',
    //             // maxAge: 7 * 24 * 60 * 60 * 1000
    //             maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE)
    //         });
    //         const userEncoded=encodeURIComponent(JSON.stringify({
    //             id: result.user.id,
    //             name: result.user.name,
    //             email: result.user.email,
    //             role: result.user.role
    //         }))
    //         const frontendUrl = `${process.env.CORS_ORIGIN}/auth/callback?token=${result.token}&isNewUser=${result.isNewUser}&user=${userEncoded}`;
    //         res.redirect(frontendUrl);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    // googleAuthFailure = (req: Request, res: Response) => {
    //     res.redirect(`${process.env.CORS_ORGIN}/login>error=google_auth_failed`)
    // }
    googleAuth=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._googleAuthUseCase.execute(req.body);
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict',
                maxAge:Number(process.env.REFRESH_TOKEN_MAX_AGE)
            });
            res.status(HttpStatus.OK).json({success:true,token:result.token,user:result.user})
        }catch(error){
            next(error);
        }
    }
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: CustomMessages.REFRESH_TOKEN_REQUIRED });
                return;
            }
            const accessToken = await this._refreshTokenUseCase.execute(refreshToken);
            res.status(HttpStatus.OK).json({ success: true, accessToken });
        } catch (error) {
            // console.error("Signup failed", error);
            next(error);
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this._verifyOtpUseCase.execute(email, otp);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.VERIFIED });
        } catch (error) {
            next(error);
        }
    }
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._forgotPasswordUseCase.execute(email);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.OTP_SENT });
        } catch (error) {
            next(error);
        }
    }
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;
            await this._resetPasswordUSeCase.execute(email, otp, newPassword);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.PASSWORD_CHANGED });
        } catch (error) {
            next(error);
        }
    }
    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._resendOtpUseCase.execute(email);
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.OTP_SENT });
        } catch (error) {
            next(error)
        }
    }
    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false, message: CustomMessages.NO_TOKEN_PROVIDED
                });
                return;
            }
            await this._logoutUseCase.execute(token);
            res.clearCookie("refreshToken");
            res.status(HttpStatus.OK).json({ success: true, message: CustomMessages.LOG_OUT });
        } catch (error) {
            next(error);
        }
    }
}