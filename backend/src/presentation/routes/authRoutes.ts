import { Router } from "express";
import container from "../../di/container";
import { validate } from "../middleware/validation.middleware";
import { signupSchema, loginSchema } from "../validation/validation.schemas";
import passport from 'passport'
import { AuthController } from "../controllers/Authcontroller";
import { TYPES } from "../../di/types";
import { rateLimit } from "../middleware/rateLimit.middleware";



// Authentication routes

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

// Rate Limiter configuration

const authLimiter=rateLimit(5,15*60);



//   POST /user/signup - Register new user
//   Validates request body against signupSchema
 
router.post("/signup", authLimiter,validate(signupSchema), authController.signup);


//   POST /user/login - Authenticate user
//   Validates request body against loginSchema


router.post("/login",authLimiter, validate(loginSchema), authController.login);

// Google OAuth routes
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

// RefresToken route

router.post("/refresh-token",authController.refreshToken);
// router.post('/send-otp',authController.sendOtp);
router.post('/verify-otp',authController.verifyOTP);
