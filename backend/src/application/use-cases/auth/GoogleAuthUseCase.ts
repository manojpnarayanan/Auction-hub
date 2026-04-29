import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ICacheService } from "../../../domain/interfaces/ICacheService";
import {  OAuthResponseDTO } from "../../dtos/user.dto";
import jwt from "jsonwebtoken";
import { config } from "../../../infrastructure/config/environment";
import { IGoogleAuthUseCase } from "../Usecase Interfaces/IGoogleAuthUseCase";
import { UserDTOMapper } from "../../DTOMapper/UserDTOMapper";
import { OAuth2Client } from "google-auth-library";

@injectable()

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
    private googleClient:OAuth2Client;
    constructor(
        @inject(TYPES.UserRepository) private _UserRepository: IUserRepository,
        @inject(TYPES.CacheService) private _cacheService: ICacheService
    ) {
        this.googleClient=new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );
     }


    async execute(data: {code:string}): Promise<OAuthResponseDTO> {

        const {tokens}=await this.googleClient.getToken(data.code);
        this.googleClient.setCredentials(tokens);


        const ticket=await this.googleClient.verifyIdToken({
            idToken:tokens.id_token!,
            audience:process.env.GOOGLE_CLIENT_ID,
        });
        const payload=ticket.getPayload();
        if(!payload || !payload.email){
            throw new Error("Invalid google token")
        };

        let user = await this._UserRepository.findByGoogleId(payload.sub);
        let isNewUser = false;

        if (!user) {
            user = await this._UserRepository.findByEmail(payload.email);
            if (!user) {
                user=await this._UserRepository.create({
                    name:payload.name ||"Google User",
                    email:payload.email,
                    googleId:payload.sub,
                    role:'user',
                    password:'',
                    isVerified:true
                });
                isNewUser=true;
            } else {
                await this._UserRepository.updateGoogleId(user.id,payload.sub);
                const updatedUser=await this._UserRepository.findByEmail(payload.email);
                if(updatedUser){
                    user=updatedUser;
                }
            }
        }
        const token = jwt.sign(
            { id: user.id, email: user!.email, role: user!.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiry as jwt.SignOptions["expiresIn"] }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            config.jwtRefreshSecret,
            { expiresIn: config.jwtRefreshExpiry as jwt.SignOptions["expiresIn"] }
        )
        await this._cacheService.set(`refresh_Token:${user.id}`, refreshToken, 7 * 24 * 60 * 60)
        return {
            message: isNewUser ? "User created successfully" : "Login successfull",
            token,
            refreshToken,
            isNewUser,
            user: UserDTOMapper.toResponseDTO(user)

        }
    }
}