import { injectable, inject } from "inversify";
import {TYPES} from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { IEmailService } from "../../domain/interfaces/IEmailService";
import { CreateUserDTO , LoginResponseDTO  } from "../dtos/user.dto";
import { ConflictError } from "../../domain/errors/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";


@injectable()

export class SignupUseCase{
    constructor(
        @inject(TYPES.UserRepository) private userRepository:IUserRepository,
        @inject(TYPES.CacheService)private cacheService:ICacheService,
        @inject(TYPES.EmailService) private emailService:IEmailService,
    ) {};

    async execute(userData:CreateUserDTO):Promise<LoginResponseDTO >{
        const existingUser= await this.userRepository.findByEmail(userData.email);
        let user;
        if(existingUser){
            if(existingUser.isVerified){
                throw new ConflictError("user already exist");
               }
               const hashedPassword=await bcrypt.hash(userData.password,10);
               user=await this.userRepository.updateUnVerifiedUser(existingUser?.id,{...userData,password:hashedPassword});
               
            }else{
                const hashedPassword=await bcrypt.hash(userData.password,10);
                user=await this.userRepository.create({...userData,password:hashedPassword})
            }

        const otp=Math.floor(100000+Math.random()*900000).toString();
        const expiry=new Date(Date.now()+60*1000);
        await this.userRepository.updateOTP(user.id,otp,expiry);
        await this.emailService.sendOTP(user.email,otp);


        const token=jwt.sign(
            {id:user.id,email:user.email,role:user.role},
            config.jwtSecret,
            {expiresIn:config.jwtExpiry as any}
        );
        const refreshToken=jwt.sign(
            {id:user.id},
            config.jwtRefreshSecret,
            {expiresIn:config.jwtRefreshExpiry as any}
        );

        await this.cacheService.set(`refresh_Token:${user.id}`,refreshToken,7*24*60*60);
        return{
            message:"OTP sent to mail",
            token,
            refreshToken,
            user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            createdAt:user.createdAt
            }
       }
    }


}
