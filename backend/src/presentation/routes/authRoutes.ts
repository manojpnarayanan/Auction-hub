import { Router } from "express";
import container from "../../di/container";
import { validate } from "../middleware/validation.middleware";
import { signupSchema, loginSchema } from "../validation/validation.schemas";
import passport from 'passport'
import { AuthController } from "../controllers/Authcontroller";
import { TYPES } from "../../di/types";
import { rateLimit } from "../middleware/rateLimit.middleware";


const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

const authLimiter = rateLimit(100, 15 * 60);




router.post("/signup", authLimiter, validate(signupSchema), authController.signup);
router.post("/login", authLimiter, validate(loginSchema), authController.login);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/user/auth/google/failure",
        session: false
    }),
    authController.googleAuthCallback
);
router.get("/auth/google/failure", authController.googleAuthFailure);
export default router;

router.post("/refresh-token", authController.refreshToken);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-otp', authController.resendOtp);
router.post("/logout", authController.logout);
