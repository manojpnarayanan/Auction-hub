import { createClient } from "redis";
import logger from "../Global/Logger";
import { config } from "../config/environment";


const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', (err) => logger.info({ err }, "Redis client Error"));
redisClient.on('connect', () => logger.info("Redis connected to Cloud"));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (_error) {
        logger.error("Failed to connect to Redis Cloud")
    }
}
export default redisClient