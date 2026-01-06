import { RefreshTokenUseCase } from "../application/use-cases/RefreshTokenUseCase";


export const TYPES={
    UserRepository:Symbol.for("UserRepository"),
    AuthController:Symbol.for("AuthController"),
    SignupUseCase:Symbol.for("SignupUseCase"),
    LoginUseCase:Symbol.for("LoginUseCase"),
    GoogleAuthUseCase:Symbol.for("GoogleAuthUseCase"),
    RefreshTokenUseCase:Symbol.for("RefreshTokenUseCase"),
    CacheService:Symbol.for("RedisCacheService"),
    EmailService:Symbol.for("EmailService")
}