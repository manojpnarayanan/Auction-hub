import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { ICacheService } from "../../../domain/interfaces/ICacheService";
import { UnauthorizedError } from "../../../domain/errors/errors";
import jwt from "jsonwebtoken";
import { config } from "../../../infrastructure/config/environment";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IRefreshTokenUseCase } from "../Usecase Interfaces/IRefreshTokenUseCase";


@injectable()

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject(TYPES.CacheService) private _cacheService: ICacheService,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository
    ) { }

    async execute(refreshToken: string): Promise<string> {
        let payload: string | jwt.JwtPayload
        try {
            payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
        } catch {
            throw new UnauthorizedError("Invalid refresh token");
        }
        const userid = (payload as jwt.JwtPayload).id;
        const storedToken = await this._cacheService.get(`refresh_Token:${userid}`);

        if (!storedToken || storedToken !== refreshToken) {
            throw new UnauthorizedError("Refresh token revoked or invalid");
        }
        const user = await this._userRepository.findById(userid);
        if (!user) throw new UnauthorizedError("User not found");
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiry as jwt.SignOptions["expiresIn"] }
        );
        return newAccessToken;
    }
}