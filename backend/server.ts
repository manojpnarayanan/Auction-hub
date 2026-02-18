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
import UploadRoutes from "./src/presentation/routes/user/UploadRoutes.js";
import adminRoutes from "./src/presentation/routes/admin/adminRoutes.js";
import CategoryRoutes from "./src/presentation/routes/admin/CategoryRoutes.js";
import bidRoutes from "./src/presentation/routes/user/BidRoutes.js";
import { ISocketService } from "./src/domain/interfaces/ISocketService.js";
import { createServer } from "http";
import container from "./src/di/container.js";
import {TYPES} from "./src/di/types.js"
import {startCronJobs} from "./src/infrastructure/Cron/Cron.js";

const app = express();
const httpServer=createServer(app);
configurePassport();


app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use("/user", authRoutes);
app.use('/auctions', auctionRoutes)
app.use('/upload', UploadRoutes);
app.use("/admin",adminRoutes);
app.use('/admin/categories',CategoryRoutes);
app.use('/bids',bidRoutes)

app.use(errorHandler);


connectDB();
connectRedis();
startCronJobs();

const socketService=container.get<ISocketService>(TYPES.SocketService);
socketService.init(httpServer)

const PORT = config.port;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



