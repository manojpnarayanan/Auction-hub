import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { HttpStatus } from "../Enums/StatusCodes"
import { CustomMessages } from "../Enums/CustomMessages";
import { ILoginUseCase } from "../../application/use-cases/Usecase Interfaces/ILoginUseCase";
import { IRefreshTokenUseCase } from "../../application/use-cases/Usecase Interfaces/IRefreshTokenUseCase";
import { IVerifyOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { IForgotPasswordUseCase } from "../../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";
import { IResendOtpUseCase } from "../../application/use-cases/Usecase Interfaces/IResendOtpUseCase";
import { ISignupUseCase } from "../../application/use-cases/Usecase Interfaces/ISignupUseCase";
import { ILogoutUseCase } from "../../application/use-cases/Usecase Interfaces/ILogoutUseCase";
import { IGoogleAuthUseCase } from "../../application/use-cases/Usecase Interfaces/IGoogleAuthUseCase";
import { ApiResponse } from "../Common/APIResponse";

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
            // logger.info(req.body);
            const result = await this._signupUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json(ApiResponse.success(result,CustomMessages.SIGNUP_SUCCESS));
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
                
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE)
            });
            res.status(HttpStatus.OK).json(ApiResponse.success({token: result.token, user: result.user },CustomMessages.LOGIN_SUCCESS));
        } catch (error) { next(error) }
    }
    
    googleAuth=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._googleAuthUseCase.execute(req.body);
            res.cookie('refreshToken',result.refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict',
                maxAge:Number(process.env.REFRESH_TOKEN_MAX_AGE)
            });
            res.status(HttpStatus.OK).json(ApiResponse.success({token: result.token, user: result.user },CustomMessages.LOGIN_SUCCESS))
        }catch(error){
            next(error);
        }
    }
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(CustomMessages.REFRESH_TOKEN_REQUIRED));
                return;
            }
            const accessToken = await this._refreshTokenUseCase.execute(refreshToken);
            res.status(HttpStatus.OK).json(ApiResponse.success({accessToken}));
        } catch (error) {
            // logger.error("Signup failed", error);
            next(error);
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp } = req.body;
            await this._verifyOtpUseCase.execute(email, otp);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.VERIFIED));
        } catch (error) {
            next(error);
        }
    }
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._forgotPasswordUseCase.execute(email);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.OTP_SENT));
        } catch (error) {
            next(error);
        }
    }
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;
            await this._resetPasswordUSeCase.execute(email, otp, newPassword);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.PASSWORD_CHANGED));
        } catch (error) {
            next(error);
        }
    }
    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._resendOtpUseCase.execute(email);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.OTP_SENT));
        } catch (error) {
            next(error)
        }
    }
    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.NO_TOKEN_PROVIDED));
                return;
            }
            await this._logoutUseCase.execute(token);
            res.clearCookie("refreshToken");
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.LOG_OUT));
        } catch (error) {
            next(error);
        }
    }
}