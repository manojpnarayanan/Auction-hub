import "reflect-metadata"
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { errorHandler } from "./src/presentation/middleware/errorHandler.middleware.js";
import { config } from "./src/infrastructure/config/environment.js";
import { configurePassport } from "./src/infrastructure/auth/passport.config.js";
import passport from "passport";
import { connectRedis } from './src/infrastructure/redis/redisClient.js'
import cookieParser from "cookie-parser";
import authRoutes from "./src/presentation/routes/authRoutes.js"
import auctionRoutes from "./src/presentation/routes/auctionRoutes.js";

const app = express();
configurePassport();


app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use("/user", authRoutes);
app.use('/auctions',auctionRoutes)


app.use(errorHandler);


connectDB();
connectRedis();


const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
