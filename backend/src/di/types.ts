

export const TYPES = {
    UserRepository: Symbol.for("UserRepository"),
    AuthController: Symbol.for("AuthController"),
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


}