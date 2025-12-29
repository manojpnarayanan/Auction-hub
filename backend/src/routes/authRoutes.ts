import { Router } from "express";
import container from "../di/container";
import { validate } from "../presentation/middleware/validation.middleware";
import { signupSchema, loginSchema } from "../presentation/validation/validation.schemas";
import passport from 'passport'
import { AuthController } from "../controller/authController";
import {TYPES} from "../di/types"

/**
 * Authentication routes
 */
const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

/**
 * POST /user/signup - Register new user
 * Validates request body against signupSchema
 */
router.post("/signup", validate(signupSchema), authController.signup);

/**
 * POST /user/login - Authenticate user
 * Validates request body against loginSchema
 */
router.post("/login", validate(loginSchema), authController.login);

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
