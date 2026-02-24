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
import { AdminController } from "../presentation/controllers/admin/AdminDashboardController";


// Auth-UseCases
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
//  Auction-useCases
import { ICreateAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { CreateAuctionUseCase } from "../application/use-cases/auction/CreateAuctionUseCase";
import { IGetAllListedAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { GetAllListedAuctionUseCase } from "../application/use-cases/auction/GetAllListedAuctionUseCase";
import { IGetAllAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { GetAllAuctionsUseCase } from "../application/use-cases/auction/GetAllAuctionsUseCase";
import { IGetAuctionDetailsUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { GetAuctionDetailsUSeCase } from "../application/use-cases/auction/GetAuctionDetailsUseCase";
import { IUpdateAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IUpdateAuctionUseCase";
import { UpdateAuctionUseCase } from "../application/use-cases/auction/UpdateAuctionUseCase";
import { IDeleteAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/IDeleteAuctionUseCase";
import { DeleteAuctionUseCase } from "../application/use-cases/auction/DeleteAuctionUseCase";

// Admin-useCases

import { IAdminUserManagementUseCase } from "../application/use-cases/Usecase Interfaces/Admin/IAdminUserManagementUseCase";
import { AdminUserManagementUseCase } from "../application/use-cases/Admin/AdminUserManagementUseCase";
import { IBlockUserUseCase } from "../application/use-cases/Usecase Interfaces/Admin/IBlockUserUseCase";
import { BlockUserUseCase } from "../application/use-cases/Admin/BlockUserUseCase";
import { IAdminAuctionManagamentUseCase } from "../application/use-cases/Usecase Interfaces/Admin/IAdminAuctionManagement";
import { ApproveAuctionUseCase } from "../application/use-cases/Admin/AdminAuctionManagement";


// Category Section
import { MongoCategoryRepository } from "../infrastructure/database/repositories/MongoCategoryRepository";
import { ICategoryRepository } from "../domain/interfaces/ICategoryRepository";
import { CreateCategoryUseCase } from "../application/use-cases/Admin/Category UseCase/CreateCategoryUseCase";
import { ICreatecategoryUseCase } from "../application/use-cases/Usecase Interfaces/Admin/Category Interface/ICreatecategoryUseCase";
import { CategoryController } from "../presentation/controllers/admin/CategoryController";
import { IGetAllCategoriesUseCase } from "../application/use-cases/Usecase Interfaces/Admin/Category Interface/IGetAllCategoriesUseCase";
import { GetAllCategoriesUseCase } from "../application/use-cases/Admin/Category UseCase/GetAllCategoriesUseCase";
import { IUpdateCategoryUseCase } from "../application/use-cases/Usecase Interfaces/Admin/Category Interface/IUpdateCategoryUseCase";
import { UpdateCategoryUseCase } from "../application/use-cases/Admin/Category UseCase/UpdateCategoryUseCase";
import { IDeleteCategoryUseCase } from "../application/use-cases/Usecase Interfaces/Admin/Category Interface/IDeleteCategoryUseCase";
import { DeleteCategoryUseCase } from "../application/use-cases/Admin/Category UseCase/DeleteCategoryUseCase";

// Bid
import { IBidRepository } from "../domain/interfaces/IBidRepository";
import { MongoBidRepository } from "../infrastructure/database/repositories/MongoBidRepository";
import { BidController } from "../presentation/controllers/user/BidController";
import { PlaceBidUseCase } from "../application/use-cases/Bid/PlaceBidUseCase";
import { IPlaceBidUseCase } from "../application/use-cases/Usecase Interfaces/Bid-interface/IPlaceBidUseCase";
import { IGetAuctionBidsUseCase } from "../application/use-cases/Usecase Interfaces/Bid-interface/IGetAuctionBidsUseCase";
import { GetAuctionBidsUseCase } from "../application/use-cases/Bid/GetAuctionBidsUseCase";
import { ISocketService } from "../domain/interfaces/ISocketService";
import { SocketService } from "../infrastructure/socket/SocketService";
import { ICloseExpiredAuctionUseCase } from "../application/use-cases/Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";
import { CloseExpiredAuctionUseCase } from "../application/use-cases/auction/CloseExpiredAuctionsUseCase";
import { IGetUserBidsUseCase } from "../application/use-cases/Usecase Interfaces/Bid-interface/IGetUserBidsUseCase";
import { GetUserBidUseCase } from "../application/use-cases/Bid/GetUserBidUseCase";

// user-Profile UseCases

import { IGetprofileUseCase } from "../application/use-cases/Usecase Interfaces/profile-interface/IGetprofileUseCase";
import { GetprofileUseCase } from "../application/use-cases/profile/GetprofileUseCase";
import { IUpdateProfileUseCase } from "../application/use-cases/Usecase Interfaces/profile-interface/IUpdateProfileUseCase";
import { UpdateProfileUseCase } from "../application/use-cases/profile/UpdateProfileUseCase";
import { IChangePasswordUseCase } from "../application/use-cases/Usecase Interfaces/profile-interface/IChangePasswordUseCase";
import { ChangePasswordUseCase } from "../application/use-cases/profile/ChangePasswordUseCase";
import { profileController } from "../presentation/controllers/user/ProfileController";

// Address Section
import { IAddressRepository } from "../domain/interfaces/IAddressRepository";
import { MongoAddressRepository } from "../infrastructure/database/repositories/MongoAddressRepository";
import { IGetAddressUseCase } from "../application/use-cases/Usecase Interfaces/Address-Interface/IGetAddressUseCase";
import { GetAddressUseCase } from "../application/use-cases/User/Address/GetAddressUseCase";
import { IAddAddressUseCase } from "../application/use-cases/Usecase Interfaces/Address-Interface/IAddAddressUseCase";
import { AddAddressUseCase } from "../application/use-cases/User/Address/AddAddressUseCase";
import { IUpdateAddressUseCase } from "../application/use-cases/Usecase Interfaces/Address-Interface/IUpdateAddressUseCase";
import { UpdateAddressUseCase } from "../application/use-cases/User/Address/UpdateAddressUseCase";
import { IDeleteAddressUseCase } from "../application/use-cases/Usecase Interfaces/Address-Interface/IDeleteAddressUseCase";
import { DeleteAddressUseCase } from "../application/use-cases/User/Address/DeleteAddressUseCase";
import { AddressController } from "../presentation/controllers/user/AddressController";
import { ISetDefaultUseCase } from "../application/use-cases/Usecase Interfaces/Address-Interface/ISetDefaultUseCase";
import { SetDefaultAddressUseCase } from "../application/use-cases/User/Address/SetDefaultAddressUseCase";




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
container.bind<IGetAllAuctionUseCase>(TYPES.GetAllAuctionsUseCase).to(GetAllAuctionsUseCase);
container.bind<IGetAuctionDetailsUseCase>(TYPES.GetAuctionDetailsUseCase).to(GetAuctionDetailsUSeCase);
container.bind<IUpdateAuctionUseCase>(TYPES.UpdateAuctionUseCase).to(UpdateAuctionUseCase);
container.bind<IDeleteAuctionUseCase>(TYPES.DeleteAuctionUseCase).to(DeleteAuctionUseCase);
container.bind<ICloseExpiredAuctionUseCase>(TYPES.CloseExpiredAuctionsUseCase).to(CloseExpiredAuctionUseCase)

// Admin-UseCases
container.bind<IAdminUserManagementUseCase>(TYPES.AdminUserManagementUseCase).to(AdminUserManagementUseCase);
container.bind<IBlockUserUseCase>(TYPES.BlockUserUseCase).to(BlockUserUseCase);
container.bind<IAdminAuctionManagamentUseCase>(TYPES.ApproveAuctionUseCase).to(ApproveAuctionUseCase);


// Category section
container.bind<ICreatecategoryUseCase>(TYPES.CreateCategoryUseCase).to(CreateCategoryUseCase);
container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(MongoCategoryRepository);
container.bind<IGetAllCategoriesUseCase>(TYPES.GetAllCategoriesUseCase).to(GetAllCategoriesUseCase);
container.bind<IUpdateCategoryUseCase>(TYPES.UpdateCategoryUSeCase).to(UpdateCategoryUseCase);
container.bind<IDeleteCategoryUseCase>(TYPES.DeleteCategoryUseCase).to(DeleteCategoryUseCase)


// Bid Section
container.bind<IBidRepository>(TYPES.BidRepository).to(MongoBidRepository);
container.bind<IPlaceBidUseCase>(TYPES.PlaceBidUseCase).to(PlaceBidUseCase);
container.bind<IGetAuctionBidsUseCase>(TYPES.GetAuctionBidsUseCase).to(GetAuctionBidsUseCase);
container.bind<ISocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();
container.bind<IGetUserBidsUseCase>(TYPES.GetUserBidUseCase).to(GetUserBidUseCase)

// user-ProfileSection
container.bind<IGetprofileUseCase>(TYPES.GetProfileUseCase).to(GetprofileUseCase);
container.bind<IUpdateProfileUseCase>(TYPES.updateProfileUseCase).to(UpdateProfileUseCase);
container.bind<IChangePasswordUseCase>(TYPES.changePasswordUseCase).to(ChangePasswordUseCase);


// Address Section
container.bind<IAddressRepository>(TYPES.AddressRepository).to(MongoAddressRepository);
container.bind<IGetAddressUseCase>(TYPES.GetAddressUseCase).to(GetAddressUseCase);
container.bind<IAddAddressUseCase>(TYPES.AddAddressUseCase).to(AddAddressUseCase);
container.bind<IUpdateAddressUseCase>(TYPES.UpdateAddressUseCase).to(UpdateAddressUseCase);
container.bind<IDeleteAddressUseCase>(TYPES.DeleteAddressUseCase).to(DeleteAddressUseCase);
container.bind<ISetDefaultUseCase>(TYPES.SetDefaultAddressUseCase).to(SetDefaultAddressUseCase);


// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuctionController>(TYPES.AuctionController).to(AuctionController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<BidController>(TYPES.BidController).to(BidController);
container.bind<CategoryController>(TYPES.CategoryController).to(CategoryController);
container.bind<profileController>(TYPES.profileController).to(profileController);
container.bind<AddressController>(TYPES.AddressController).to(AddressController);

// Bind Redis
container.bind<ICacheService>(TYPES.CacheService).to(RedisCacheService);

export default container;