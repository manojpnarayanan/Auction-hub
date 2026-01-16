import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types"
// Repositories
import { MongoUserRepository } from "../infrastructure/database/repositories/MongoUserRepository";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { MongoAuctionRepository } from "../infrastructure/database/repositories/MongoAuctionRepository";
import { IAuctionRepository } from "../domain/interfaces/IAuctionRepository";

// Redis
import { RedisCacheService } from "../infrastructure/redis/RedisCacheService";
import { ICacheService } from "../domain/interfaces/ICacheService";

// Controllers
import { AuthController } from "../presentation/controllers/Authcontroller";
import { AuctionController } from "../presentation/controllers/AuctionController";


// UseCases
import { ISignupUseCase } from "../application/use-cases/Usecase Interfaces/ISignupUseCase";
import { SignupUseCase } from "../application/use-cases/auth/SignupUseCase";
import { IRefreshTokenUseCase } from "../application/use-cases/Usecase Interfaces/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../application/use-cases/auth/RefreshTokenUseCase";
import { ILoginUseCase } from "../application/use-cases/Usecase Interfaces/ILoginUseCase";
import { LoginUseCase } from "../application/use-cases/auth/LoginUseCase";
import { IGoogleAuthUseCase } from "../application/use-cases/Usecase Interfaces/IGoogleAuthUseCase";
import { GoogleAuthUseCase } from "../application/use-cases/auth/GoogleAuthUseCase";
import { VerifyOtpUseCase } from "../application/use-cases/auth/VerifyOtpUseCase";
import { ForgotPasswordUseCase } from "../application/use-cases/auth/ForgotPasswordUseCase";
import { IEmailService } from "../domain/interfaces/IEmailService";
import { EmailService } from "../infrastructure/email/EmailService";
import { IVerifyOtpUseCase } from "../application/use-cases/Usecase Interfaces/IVerifyOtpUseCase";
import { IForgotPasswordUseCase } from "../application/use-cases/Usecase Interfaces/IForgotPasswordUseCase";
import { IResetPasswordUseCase } from "../application/use-cases/Usecase Interfaces/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../application/use-cases/auth/ResetPasswordUseCase";
import { IResendOtpUseCase } from "../application/use-cases/Usecase Interfaces/IResendOtpUseCase";
import { ResendOtpUseCase } from "../application/use-cases/auth/ResendOtpUseCase";
import { ILogoutUseCase } from "../application/use-cases/Usecase Interfaces/ILogoutUseCase";
import { LogoutUseCase } from "../application/use-cases/auth/LogoutUseCase";

import { ICreateAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { CreateAuctionUseCase } from "../application/use-cases/auction/CreateAuctionUseCase";
import { IGetAllListedAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { GetAllListedAuctionUseCase } from "../application/use-cases/auction/GetAllListedAuctionUseCase";
import { IGetAllAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { GetAllAuctionsUseCase } from "../application/use-cases/auction/GetAllAuctionsUseCase";

const container = new Container();
// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);
container.bind<IAuctionRepository>(TYPES.AuctionRepository).to(MongoAuctionRepository);

//  Auth useCases
container.bind<ISignupUseCase>(TYPES.SignupUseCase).to(SignupUseCase);
container.bind<ILoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<IGoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase);
container.bind<IRefreshTokenUseCase>(TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IVerifyOtpUseCase>(TYPES.verifyOtpUseCase).to(VerifyOtpUseCase);
container.bind<IForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
container.bind<IResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
container.bind<IResendOtpUseCase>(TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
container.bind<ILogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);

// Auction useCases
container.bind<ICreateAuctionUseCase>(TYPES.CreateAuctionUseCase).to(CreateAuctionUseCase);
container.bind<IGetAllListedAuctionUseCase>(TYPES.GetSellerAuctionUseCase).to(GetAllListedAuctionUseCase);
container.bind<IGetAllAuctionUseCase>(TYPES.GetAllAuctionsUseCase).to(GetAllAuctionsUseCase)


// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuctionController>(TYPES.AuctionController).to(AuctionController);


// Bind Redis
container.bind<ICacheService>(TYPES.CacheService).to(RedisCacheService);

export default container;