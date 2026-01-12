import { injectable,inject } from "inversify";
import {TYPES} from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { GoogleAuthDTO,OAuthResponseDTO } from "../dtos/user.dto";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";
import { IGoogleAuthUseCase } from "./Usecase Interfaces/IGoogleAuthUseCase";


@injectable()

export class GoogleAuthUseCase implements IGoogleAuthUseCase{
    constructor(
        @inject(TYPES.UserRepository)private UserRepository:IUserRepository,
        @inject(TYPES.CacheService) private cacheService:ICacheService
    ) {}

    async execute (data:GoogleAuthDTO):Promise<OAuthResponseDTO>{
        let user=await this.UserRepository.findByGoogleId(data.googleId);
        let isNewUser=false;
        if(!user){
            user=await this.UserRepository.findByEmail(data.email);
            if(user){

            }else{
                user=await this.UserRepository.create({
                    name:data.name,
                    email:data.email,
                    googleId:data.googleId,
                    role:"user",
                    password:"",
                    isVerified:true
                });
                isNewUser=true;
            }
        }
        const token=jwt.sign(
            {id:user.id,email:user!.email,role:user!.role},
            config.jwtSecret,
            {expiresIn:config.jwtExpiry as any}
        );
        const refreshToken=jwt.sign(
            {id:user.id},
            config.jwtRefreshSecret,
            {expiresIn:config.jwtRefreshExpiry as any}
        )
        await this.cacheService.set(`refresh_Token:${user.id}`,refreshToken,7*24*60*60)
        return {
            message:isNewUser? "User created successfully":"Login successfull",
            token,
            refreshToken,
            isNewUser,
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