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
import { IStartLiveAuctionUseCase } from "../application/use-cases/Usecase Interfaces/live-Auctions/IStartLiveAuctionUseCase";
import { StartLiveAuctionUseCase } from "../application/use-cases/User/Live-Auctions/StartLiveAuctionUseCase";
import { IEndLiveAuctionUseCase } from "../application/use-cases/Usecase Interfaces/live-Auctions/IEndLiveAuctionUseCase";
import { EndLiveAuctionUseCase } from "../application/use-cases/User/Live-Auctions/EndLiveAuctionUseCase";
import { ICancelLiveAuctionUseCase } from "../application/use-cases/Usecase Interfaces/live-Auctions/ICancelLiveAuctionUseCase";
import { CancelLiveAuctionUseCase } from "../application/use-cases/User/Live-Auctions/CancelLiveAuctionUseCase";



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
import { BidListener } from "../application/Listeners/BidListener";


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

// payment-Selection

import { IPaymentService } from "../domain/interfaces/IPaymentService";
import { StripeService } from "../infrastructure/Service/stripeService";
import { IWalletRepository } from "../domain/interfaces/IWalletRepository";
import { MongoWalletRepository } from "../infrastructure/database/repositories/MongoWalletRepository";
import { IGetWalletUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/IGetWalletUseCase";
import { GetWalletUseCase } from "../application/use-cases/User/Wallet/GetWalletUseCase";
import { ICreatePaymentIntentUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/ICreatePaymentIntentUseCase";
import { CreatePaymentIntentUseCase } from "../application/use-cases/User/Wallet/createPaymentIntentUseCase";
import { IconfirmPaymentUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/IConfirmPaymentUseCase";
import { ConfirmPayment } from "../application/use-cases/User/Wallet/confirmPaymentUseCase";
import { IReleasePaymentUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { ReleasePaymentUseCase } from "../application/use-cases/User/Wallet/releasePaymentUseCase";
import { IHandleWebhookUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/IHandleWebhookUseCase";
import { HandleWebhookUseCase } from "../application/use-cases/User/Wallet/handleWebhookUseCase";
import { WalletController } from "../presentation/controllers/user/WalletController";
import { AdminPaymentController } from "../presentation/controllers/admin/AdminWalletController";
import { WebhookController } from "../presentation/controllers/WebhookController";
import { IGetPendingReleaseUseCase } from "../application/use-cases/Usecase Interfaces/Wallet-interfaces/IGetPendingUseCase";
import { GetPendingReleaseUseCase } from "../application/use-cases/User/Wallet/GetPendingReleaseUseCase";

//Subscription-Section

import { ISubscriptionRepository } from "../domain/interfaces/ISubscriptionRepository";
import { MongoSubscriptionRepository } from "../infrastructure/database/repositories/MongoSubscriptionRepository";
import { IGetSubscriptionUseCase } from "../application/use-cases/Usecase Interfaces/Subscription-Interface/IGetSubscriptionUseCase";
import { GetSubscriptionUseCase } from "../application/use-cases/User/Subscriptions/GetSubscriptionUseCase";
import { ISubscribePlanUseCase } from "../application/use-cases/Usecase Interfaces/Subscription-Interface/ISubcribePlanUseCase";
import { SubscribePlanUseCase } from "../application/use-cases/User/Subscriptions/SubscribePlanUseCase";
import { SubscriptionController } from "../presentation/controllers/user/SubscriptionController";
import { ISubscriptionPlanRepository } from "../domain/interfaces/ISubscriptionPlanRepository";
import { SubscriptionPlanRepository } from "../infrastructure/database/repositories/MongoSubscriptionPlanRepository";
import { ICreateSubscriptionPlanUseCase } from "../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/ICreateSubscriptionPlanUseCase";
import { CreateSubscriptionPlanUseCase } from "../application/use-cases/User/SubscriptionPlan/CreateSubscriptionPlanUseCase";
import { IGetAllSubscriptionPlanUseCase } from "../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IGetAllSubscriptionPlanUseCase";
import { GetAllSubscriptionPlanUseCase } from "../application/use-cases/User/SubscriptionPlan/GetAllSubscriptionPlanUseCase";
import { IDeleteSubscriptionPlanUseCase } from "../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IDeleteSubscriptionPlanUseCase";
import { DeleteSubscriptionPlanUseCase } from "../application/use-cases/User/SubscriptionPlan/DeleteSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IUpdateSubscriptionPlanUseCase";
import { UpdataSubscriptionPlanUseCase } from "../application/use-cases/User/SubscriptionPlan/UpdateSubscriptionPlanUseCase";
import { SubscriptionPlanController } from "../presentation/controllers/admin/SubscriptionPlanController";
import { ICreateSubscriptionPaymentIntentUseCase } from "../application/use-cases/Usecase Interfaces/Subscription-Interface/ICreateSubscriptionPaymentIntentUseCase";
import { createSubscriptionPaymentIntentUseCase } from "../application/use-cases/User/Subscriptions/CreateSubscriptionPaymentIntentUseCase";
import { IConfirmSubscriptionPaymentUseCase } from "../application/use-cases/Usecase Interfaces/Subscription-Interface/IConfirmSubscriptionPaymentUseCase";
import { confirmSubscriptionPaymentUseCase } from "../application/use-cases/User/Subscriptions/ConfirmSubscriptionPaymentUseCase";


// Wishlist-Section
import { IWatchlistRepository } from "../domain/interfaces/IWatchlistRepository";
import { MongoWatchlistRepository } from "../infrastructure/database/repositories/MongoWatchlistRepository";
import { IGetWatchlistUseCase } from "../application/use-cases/Usecase Interfaces/Watchlist-Interface/IGetWatchlistUseCase";
import { GetWatchlistUseCase } from "../application/use-cases/User/Watchlist/GetWatchlistUseCase";
import { IRemoveFromWatchlistUseCase } from "../application/use-cases/Usecase Interfaces/Watchlist-Interface/IRemoveFromWatchlistUseCase";
import { RemoveFromWatchlistUseCase } from "../application/use-cases/User/Watchlist/RemoveFromWatchlistUseCase";
import { ICheckWatchlistUseCase } from "../application/use-cases/Usecase Interfaces/Watchlist-Interface/ICheckWatchlistUseCase";
import { CheckWatchlistUseCase } from "../application/use-cases/User/Watchlist/CheckWatchlistUseCase";
import { IAddToWatchlistUseCase } from "../application/use-cases/Usecase Interfaces/Watchlist-Interface/IAddToWatchlistUseCase";
import { AddToWatchlistUseCase } from "../application/use-cases/User/Watchlist/AddToWatchlistUseCase";
import { WatchlistController } from "../presentation/controllers/user/WatchlistController";
import { IEventEmitter } from "../domain/interfaces/IEventEmitter";
import { DomainEventEmitter } from "../infrastructure/events/DomainEventEmitter";
import { IRequestCancellationUseCase } from "../application/use-cases/Usecase Interfaces/live-Auctions/IRequestCancellationUseCase";
import { RequestCancellationUseCase } from "../application/use-cases/User/Live-Auctions/RequestCancellationUseCase";

// Notification Section

import { INotificationRepository } from "../domain/interfaces/INotificationRepository";
import { MongoNotificationRepository } from "../infrastructure/database/repositories/MongoNotificationRepository";
import { INotificationService } from "../domain/interfaces/INotificationService";
import { SocketNotificationService } from "../infrastructure/socket/SocketNotificationService";
import { IGetNotificationUseCase } from "../application/use-cases/Usecase Interfaces/Notification-Interface/IGetNotificationUseCase";
import { GetNotificationUseCase } from "../application/use-cases/User/Notification/GetNotificationUseCase";
import { IMarkNotificationReadUseCase } from "../application/use-cases/Usecase Interfaces/Notification-Interface/IMarkNotificationReadUseCase";
import { MarkNotificationReadUseCase } from "../application/use-cases/User/Notification/MarkNotificationsReadUseCase";
import { NotificationController } from "../presentation/controllers/user/NotificationController";
import { NotificationListener } from "../application/Listeners/NotificationListener";
import { ICreateNotificationUseCase } from "../application/use-cases/Usecase Interfaces/Notification-Interface/ICreateNotificationUseCase";
import { CreateNotificationUseCase } from "../application/use-cases/User/Notification/CreateNotificationUseCase";




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
container.bind<ICloseExpiredAuctionUseCase>(TYPES.CloseExpiredAuctionsUseCase).to(CloseExpiredAuctionUseCase);
container.bind<IStartLiveAuctionUseCase>(TYPES.StartLiveAuctionUseCase).to(StartLiveAuctionUseCase);
container.bind<IEndLiveAuctionUseCase>(TYPES.EndLiveAuctionUseCase).to(EndLiveAuctionUseCase);
container.bind<ICancelLiveAuctionUseCase>(TYPES.CancelLiveAuctionUseCase).to(CancelLiveAuctionUseCase);
container.bind<IRequestCancellationUseCase>(TYPES.RequestCancellationUseCase).to(RequestCancellationUseCase);


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
container.bind<IGetUserBidsUseCase>(TYPES.GetUserBidUseCase).to(GetUserBidUseCase);
container.bind<BidListener>(TYPES.BidListener).to(BidListener).inSingletonScope();
container.bind<IEventEmitter>(TYPES.EventEmitter).to(DomainEventEmitter).inSingletonScope();

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

// Payment-Section
container.bind<IPaymentService>(TYPES.PaymentService).to(StripeService).inSingletonScope();
container.bind<IWalletRepository>(TYPES.WalletRepository).to(MongoWalletRepository);
container.bind<IGetWalletUseCase>(TYPES.GetWalletUseCase).to(GetWalletUseCase);
container.bind<ICreatePaymentIntentUseCase>(TYPES.CreatePaymentIntentUseCase).to(CreatePaymentIntentUseCase);
container.bind<IconfirmPaymentUseCase>(TYPES.ConfirmPaymentUseCase).to(ConfirmPayment);
container.bind<IReleasePaymentUseCase>(TYPES.ReleasePaymentUseCase).to(ReleasePaymentUseCase);
container.bind<IHandleWebhookUseCase>(TYPES.HandleWebhookUseCase).to(HandleWebhookUseCase);
container.bind<IGetPendingReleaseUseCase>(TYPES.GetPendingReleaseUseCase).to(GetPendingReleaseUseCase);


// Subscription
container.bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(MongoSubscriptionRepository);
container.bind<IGetSubscriptionUseCase>(TYPES.GetSubscriptionUseCase).to(GetSubscriptionUseCase);
container.bind<ISubscribePlanUseCase>(TYPES.SubscribePlanUseCase).to(SubscribePlanUseCase);
// container.bind<IcreateSubscriptionCheckoutUseCase>(TYPES.CreateSubscriptionCheckoutUseCase).to(createSubscriptionCheckoutUseCase);
container.bind<ICreateSubscriptionPaymentIntentUseCase>(TYPES.CreateSubscriptionPaymentIntentUseCase).to(createSubscriptionPaymentIntentUseCase);
container.bind<IConfirmSubscriptionPaymentUseCase>(TYPES.ConfirmSubscriptionPaymentUseCase).to(confirmSubscriptionPaymentUseCase)

// SubscriptionPlanS
container.bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository).to(SubscriptionPlanRepository);
container.bind<ICreateSubscriptionPlanUseCase>(TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase);
container.bind<IGetAllSubscriptionPlanUseCase>(TYPES.GetAllSubscriptionPlanUseCase).to(GetAllSubscriptionPlanUseCase);
container.bind<IDeleteSubscriptionPlanUseCase>(TYPES.DeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase);
container.bind<IUpdateSubscriptionPlanUseCase>(TYPES.UpdateSubscriptionPlanUseCase).to(UpdataSubscriptionPlanUseCase);

// Watchlist Section
container.bind<IWatchlistRepository>(TYPES.WatchlistRepository).to(MongoWatchlistRepository)
container.bind<IGetWatchlistUseCase>(TYPES.GetWatchlistUseCase).to(GetWatchlistUseCase);
container.bind<IRemoveFromWatchlistUseCase>(TYPES.RemoveFromWatchlistUseCase).to(RemoveFromWatchlistUseCase);
container.bind<ICheckWatchlistUseCase>(TYPES.CheckWatchlistUseCase).to(CheckWatchlistUseCase);
container.bind<IAddToWatchlistUseCase>(TYPES.AddToWatchlistUseCase).to(AddToWatchlistUseCase);


// Notification-Service
container.bind<ICreateNotificationUseCase>(TYPES.CreateNotificationUseCase).to(CreateNotificationUseCase)
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(MongoNotificationRepository);
container.bind<INotificationService>(TYPES.NotificationService).to(SocketNotificationService);
container.bind<IGetNotificationUseCase>(TYPES.GetNotificationUseCase).to(GetNotificationUseCase);
container.bind<IMarkNotificationReadUseCase>(TYPES.MarkNotificationReadUseCase).to(MarkNotificationReadUseCase);
container.bind<NotificationListener>(TYPES.NotificationListener).to(NotificationListener).inSingletonScope();

// Bind Contoller
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuctionController>(TYPES.AuctionController).to(AuctionController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<BidController>(TYPES.BidController).to(BidController);
container.bind<CategoryController>(TYPES.CategoryController).to(CategoryController);
container.bind<profileController>(TYPES.profileController).to(profileController);
container.bind<AddressController>(TYPES.AddressController).to(AddressController);
container.bind<WalletController>(TYPES.WalletController).to(WalletController);
container.bind<AdminPaymentController>(TYPES.AdminPaymentController).to(AdminPaymentController);
container.bind<WebhookController>(TYPES.WebhookController).to(WebhookController);
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
container.bind<SubscriptionPlanController>(TYPES.SubscriptionPlanController).to(SubscriptionPlanController)
container.bind<WatchlistController>(TYPES.WatchlistController).to(WatchlistController);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController)

// Bind Redis
container.bind<ICacheService>(TYPES.CacheService).to(RedisCacheService);

export default container;
