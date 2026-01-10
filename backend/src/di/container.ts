import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types"
// Repositories
import { MongoUserRepository } from "../infrastructure/database/repositories/MongoUserRepository";
import { IUserRepository } from "../domain/interfaces/IUserRepository";

// Redis
import { RedisCacheService } from "../infrastructure/redis/RedisCacheService";
import { ICacheService } from "../domain/interfaces/ICacheService";
// UseCases
import { SignupUseCase } from "../application/use-cases/SignupUseCase";
import { RefreshTokenUseCase } from "../application/use-cases/RefreshTokenUseCase";
import { LoginUseCase } from "../application/use-cases/LoginUseCase";
import { GoogleAuthUseCase } from "../application/use-cases/GoogleAuthUseCase";
import { VerifyOtpUseCase } from "../application/use-cases/auth/VerifyOtpUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/auth/ForgotPasswordUseCase";
import { IEmailService } from "../domain/interfaces/IEmailService";
import { AuthController } from "../presentation/controllers/Authcontroller";
import { EmailService } from "../infrastructure/email/EmailService";
import { IVerifyOtpUseCase } from "../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IForgotPasswordUseCase } from "../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/auth/ResetPasswordUseCase";



const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);

// useCases
container.bind<SignupUseCase>(TYPES.SignupUseCase).to(SignupUseCase);
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase)
container.bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase)
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IVerifyOtpUseCase>(TYPES.verifyOtpUseCase).to(VerifyOtpUseCase);
container.bind<IForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase)
container.bind<IResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);

// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

// Bind Redis
container.bind<ICacheService>(TYPES.CacheService).to(RedisCacheService)

export default container;