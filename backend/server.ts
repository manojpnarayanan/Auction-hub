import "reflect-metadata"
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/presentation/routes/authRoutes.js"
import { errorHandler } from "./src/presentation/middleware/errorHandler.middleware.js";
import { config } from "./src/infrastructure/config/environment.js";
import { configurePassport } from "./src/infrastructure/auth/passport.config.js";
import passport from "passport";
import {connectRedis} from './src/infrastructure/redis/redisClient.js'

/**
 * Initialize Express application
 */
const app = express();

// Configure Passport
configurePassport();

/**
 * Middleware
 */
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

/**
 * Routes
 */
app.use("/user", authRoutes);

/**
 * Global error handler (must be last)
 */
app.use(errorHandler);

/**
 * Database connection
 */
connectDB();
connectRedis();

/**
 * Start server
 */
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
