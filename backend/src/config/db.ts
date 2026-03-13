import mongoose from "mongoose";
import logger from "../infrastructure/Global/Logger";
import { config } from "../infrastructure/config/environment.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl, {
            dbName: "auctionhub"
        });
        logger.info("DB connected successfully");
    } catch (err) {
        logger.info({ err }, "MongoDB error");
        process.exit(1);
    }
};


