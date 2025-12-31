import { injectable,inject } from "inversify";
import {TYPES} from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { LoginDTO , LoginResponseDTO } from "../dtos/user.dto";
import { UnauthorizedError } from "../../domain/errors/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";

@injectable()

export class LoginUseCase{
    constructor(@inject(TYPES.UserRepository) private userRepository:IUserRepository ) { };
    async execute(credentials:LoginDTO):Promise<LoginResponseDTO>{
        const user=await this.userRepository.findByEmail(credentials.email);
        if(!user || !user.password){
            throw new UnauthorizedError("Invalid Credentials"); 
        }
        const isValid=await bcrypt.compare(credentials.password,user.password);
        if(!isValid) throw new UnauthorizedError("Invalid credentials");
        const token=jwt.sign(
            {id:user.id,email:user.email,role:user.role},
            config.jwtSecret,
            {expiresIn:config.jwtExpiry as any}
        );
        return {
            message:"Login successful",
            token,
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