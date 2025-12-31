import {Request,Response ,NextFunction } from "express";
import { injectable,inject } from "inversify";
import {TYPES} from "../../di/types";

import { SignupUseCase } from "../../application/use-cases/SignupUseCase";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";

@injectable()

export class AuthController{
    constructor(
        @inject(TYPES.SignupUseCase) private signupUseCase:SignupUseCase,
        @inject(TYPES.LoginUseCase) private loginUsecase:LoginUseCase
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
}