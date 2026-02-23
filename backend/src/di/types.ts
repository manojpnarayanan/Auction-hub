

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
    profileController:Symbol.for("profileController")

}