

export const TYPES = {
    //    Auth
    AuthController: Symbol.for("AuthController"),
    UserRepository: Symbol.for("UserRepository"),
    SignupUseCase: Symbol.for("SignupUseCase"),
    LoginUseCase: Symbol.for("LoginUseCase"),
    GoogleAuthUseCase: Symbol.for("GoogleAuthUseCase"),
    RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
    CacheService: Symbol.for("RedisCacheService"),
    EmailService: Symbol.for("EmailService"),
    verifyOtpUseCase: Symbol.for("verifyOtpUseCase"),
    ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
    ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
    ResendOtpUseCase: Symbol.for("ResendOtpUseCase"),
    LogoutUseCase: Symbol.for("LogoutUseCase"),

    // Auction 
    AuctionController: Symbol.for("AuctionController"),
    AuctionRepository: Symbol.for("AuctionRepository"),
    CreateAuctionUseCase: Symbol.for("CreateAuctionUseCase"),
    GetSellerAuctionUseCase: Symbol.for("GetSellerAuctionUseCase"),
    GetAllAuctionsUseCase: Symbol.for("GetAllAuctionsUseCase"),
    GetAuctionDetailsUseCase: Symbol.for("GetAuctionDetailsUseCase"),
    UpdateAuctionUseCase: Symbol.for("UpdateAuctionUseCase"),
    DeleteAuctionUseCase:Symbol.for("DeleteAuctionUseCase"),


    // Admin 
    AdminUserManagementUseCase:Symbol.for("AdminUserManagementUseCase"),
    AdminController:Symbol.for("AdminController"),
    BlockUserUseCase:Symbol.for("BlockUserUseCase"),
    ApproveAuctionUseCase:Symbol.for("ApproveAuctionUseCase"),

    
    //  Category
    CategoryRepository:Symbol.for("CategoryRepository"),
    CategoryController:Symbol.for("CategoryController"),
    CreateCategoryUseCase:Symbol.for("CreateCategoryUseCase"),
    GetAllCategoriesUseCase:Symbol.for("GetAllCategoriesUseCase"),
    UpdateCategoryUSeCase:Symbol.for("UpdateCategoryUseCase"),
    DeleteCategoryUseCase:Symbol.for("DeleteCategoryUseCase"),

    // Bid
    BidRepository:Symbol.for("BidRepository"),
    BidController:Symbol.for("BidController"),
    PlaceBidUseCase:Symbol.for("PlacebidUseCase"),
    GetAuctionBidsUseCase:Symbol.for("GetAuctionBidsUseCase"),
    SocketService:Symbol.for("SocketService"),
    CloseExpiredAuctionsUseCase:Symbol.for("CloseExpiredAuctionsUseCase"),
    GetUserBidUseCase:Symbol.for("GetUSerBidUseCase"),


    // user Profile
    GetProfileUseCase:Symbol.for("GetProfileUseCase"),
    updateProfileUseCase:Symbol.for("updateProfileUseCase"),
    changePasswordUseCase:Symbol.for("changePasswordUseCase"),
    profileController:Symbol.for("profileController"),



    // Address
    AddressRepository:Symbol.for("AddressRepository"),
    GetAddressUseCase:Symbol.for("GetAddressUseCase"),
    AddAddressUseCase:Symbol.for("AddAddressUseCase"),
    UpdateAddressUseCase:Symbol.for("UpdateAddressUseCase"),
    DeleteAddressUseCase:Symbol.for("DeleteAddressUseCase"),
    SetDefaultAddressUseCase:Symbol.for("SetDefaultAddressUseCase"),
    AddressController:Symbol.for("AddressController"),

    // Payment
    PaymentService:Symbol.for("PaymentService"),
    WalletRepository:Symbol.for('WalletRepository'),
    GetWalletUseCase:Symbol.for("GetWalletUseCase"),
    CreatePaymentIntentUseCase:Symbol.for('CreatePaymentIntentUseCase'),
    ConfirmPaymentUseCase:Symbol.for('ConfirmPaymentUseCase'),
    ReleasePaymentUseCase:Symbol.for('ReleasePaymentUseCase'),
    HandleWebhookUseCase:Symbol.for('HandleWebhookUseCase'),
    WalletController:Symbol.for('WalletController'),
    AdminPaymentController:Symbol.for('AdminPaymentController'),
    WebhookController:Symbol.for('WebhookController'),

    // Subscription 
    SubscriptionRepository:Symbol.for('SubscriptionRepository'),
    SubscriptionController:Symbol.for('SubcriptionController'),
    SubscribePlanUseCase:Symbol.for('SubscribePlanUseCase'),
    GetSubscriptionUseCase:Symbol.for('GetSubscriptionUseCase'),
    // CreateSubscriptionChe ckoutUseCase:Symbol.for("CreateSubscriptionCheckoutUseCase"),
    CreateSubscriptionPaymentIntentUseCase:Symbol.for("CreateSubscriptionPaymentIntentUseCase"),
    ConfirmSubscriptionPaymentUseCase:Symbol.for("ConfirmSubscriptionPaymentUseCase"),


    // Subscription-Plan
    SubscriptionPlanRepository:Symbol.for("SubscriptionPlanRepository"),
    SubscriptionPlanController:Symbol.for("SubscriptionPlanController"),
    CreateSubscriptionPlanUseCase:Symbol.for("CreateSubscriptionPlanUseCase"),
    GetAllSubscriptionPlanUseCase:Symbol.for("GetAllSubscriptionPlanUseCase"),
    UpdateSubscriptionPlanUseCase:Symbol.for("UpdateSubscriptionPlanUseCase"),
    DeleteSubscriptionPlanUseCase:Symbol.for("DeleteSubscriptionPlanUseCase")
}