import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { LoginDTO, LoginResponseDTO } from "../dtos/user.dto";
import { UnauthorizedError } from "../../domain/errors/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";
import { ILoginUseCase } from "./Usecase Interfaces/ILoginUseCase";
 


@injectable()
export class LoginUseCase implements ILoginUseCase{
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.CacheService) private cacheService: ICacheService,
    ) { };
    async execute(credentials: LoginDTO): Promise<LoginResponseDTO> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user || !user.password) {
            throw new UnauthorizedError("Invalid Credentials");
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new UnauthorizedError("Invalid credentials");

        // Access Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiry as any }
        );

        // Refresh Token
        const refreshToken = jwt.sign(
            { id: user.id },
            config.jwtRefreshSecret,
            { expiresIn: config.jwtRefreshExpiry as any }
        );
        await this.cacheService.set(`refresh_Token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

        return {
            message: "Login successful",
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        }
    }
}