import { injectable ,inject } from "inversify";
import {TYPES} from "../../di/types";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { UnauthorizedError } from "../../domain/errors/errors";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";


@injectable()

export class RefreshTokenUseCase{
    constructor(
        @inject(TYPES.CacheService) private cacheService:ICacheService,
        @inject(TYPES.UserRepository) private userRepository:IUserRepository
    ) {}

    async execute (refreshToken:string):Promise<string>{
        let payload:any;
        try{
            payload=jwt.verify(refreshToken,config.jwtRefreshSecret);
        }catch{
            throw new UnauthorizedError("Invalid refresh token");
        }
        const userid=payload.id;
        const storedToken=await this.cacheService.get(`refresh_Token:${userid}`);

        if(!storedToken || storedToken !== refreshToken){
            throw new UnauthorizedError( "Refresh token revoked or invalid");
        }
        const user=await this.userRepository.findById(userid);
        if(!user)throw new UnauthorizedError("User not found");
        const newAccessToken=jwt.sign(
            {id:user.id, email:user.email , role:user.role },
            config.jwtSecret,
            {expiresIn:config.jwtExpiry as any}
        );
        return newAccessToken;
    }
}