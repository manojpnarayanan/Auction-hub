import {Request,Response ,NextFunction } from "express";
import { injectable,inject } from "inversify";
import {TYPES} from "../../di/types";

import { SignupUseCase } from "../../application/use-cases/SignupUseCase";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUseCase";
import { EmailService } from "../../infrastructure/email/EmailService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { NotFoundError, ValidationError } from "../../domain/errors/errors";


@injectable()

export class AuthController{
    constructor(
        @inject(TYPES.SignupUseCase) private signupUseCase:SignupUseCase,
        @inject(TYPES.LoginUseCase) private loginUsecase:LoginUseCase,
        @inject(TYPES.RefreshTokenUseCase) private refreshTokenUseCase:RefreshTokenUseCase,
        @inject(TYPES.EmailService) private emailService:EmailService,
        @inject(TYPES.UserRepository) private userRepository:IUserRepository
    ) {}

    signup=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this.signupUseCase.execute(req.body);
            res.status(201).json({success:true , data:result});
        }catch (error){
            next(error);
        }
    }
    login=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this.loginUsecase.execute(req.body);
            res.status(200).json({success:true,...result});
        }catch(error){next(error)}
    }
    googleAuthCallback=async (req:Request,res:Response,next:NextFunction)=>{
         try{
            const result=req.user as any;
            const frontendUrl=`${process.env.CORS_ORIGIN}/auth/callback?token=${result.token}&isNewUser=${result.isNewUser}`;
            res.redirect(frontendUrl);
        } catch (error) {
            next(error);
        }
    }
    googleAuthFailure=(req:Request,res:Response)=>{
        res.redirect(`${process.env.CORS_ORGIN}/login>error=google_auth_failed`)
    }
    refreshToken=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {refreshToken} =req.body;
            if(!refreshToken){
                res.status(400).json({success:false, message:"Refresh token required"});
                return;
            }
            const accessToken=await this.refreshTokenUseCase.execute(refreshToken);
            res.status(200).json({success:true,accessToken});
        }catch(error){
            console.error("Signup failed",error);
            next(error);
        }
    }
    // sendOtp=async(req:Request,res:Response,next:NextFunction)=>{
    //     try{
    //         const {email}=req.body;
    //         const otp=Math.floor(100000*Math.random()*900000).toString();
    //         const expiry=new Date(Date.now()+60*1000);
    //         const user=this.userRepository.findByEmail(email);
    //         if(!user) throw new NotFoundError("User not found");

    //         await this.userRepository.updateOTP(user.id,otp,expiry);
    //         await this.emailService.sendOTP(email,otp);
    //         res.status(200).json({successs:true,message:"oTP Send"})
    //     }catch(error){
    //         next(error);
    //     }
    // }
    verifyOTP=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {email,otp}=req.body;
            const user=await this.userRepository.findByEmail(email);
            if(!user)throw new NotFoundError("user  not found");
            if(user.otp !== otp) throw new ValidationError("OTP Invalid");
            if(new Date()>new Date(user.otpExpiry!)) throw new ValidationError("OTP Expired");

            await this.userRepository.updateVerifyStatus(user.id,true);
            await this.userRepository.updateOTP(user.id,null,null);
            res.status(200).json({success:true,message:"Verified"});
        }catch(error){
            next(error);
        }
    }
}