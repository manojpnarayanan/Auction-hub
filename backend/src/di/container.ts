import "reflect-metadata";
import { Container } from "inversify";
import {TYPES} from "./types"
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
import { EmailService } from "../infrastructure/email/EmailService"; 
import { AuthController } from "../presentation/controllers/Authcontroller";

const container=new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);

// useCases
container.bind<SignupUseCase>(TYPES.SignupUseCase).to(SignupUseCase);
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase)
container.bind<RefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase)
container.bind<EmailService>(TYPES.EmailService).to(EmailService);
// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

// Bind Redis
container.bind<ICacheService>(TYPES.CacheService).to(RedisCacheService)

export default container;