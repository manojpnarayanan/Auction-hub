import mongoose from "mongoose";
import { config } from "../infrastructure/config/environment.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl, {
            dbName: "auctionhub"
        });
        console.log("DB connected successfully");
    } catch (err) {
        console.log("MongoDB error", err);
        process.exit(1);
    }
};
