import { injectable,inject } from "inversify";
import {TYPES} from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { GoogleAuthDTO,OAuthResponseDTO } from "../dtos/user.dto";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";

@injectable()

export class GoogleAuthUseCase{
    constructor(
        @inject(TYPES.UserRepository)private UserRepository:IUserRepository
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
                    password:""
                });
                isNewUser=true;
            }
        }
        const token=jwt.sign(
            {id:user.id,email:user!.email,role:user!.role},
            config.jwtSecret,
            {expiresIn:config.jwtExpiry as any}
        )
        return {
            message:isNewUser? "User created successfully":"Login successfull",
            token,
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