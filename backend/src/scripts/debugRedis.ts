
import logger from '../infrastructure/Global/Logger';
import { createClient } from 'redis';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkRedis = async () => {
    // logger.info("🔌 Connecting to Redis...");
    const client = createClient({ url: process.env.REDIS_URL });

    client.on('error', (err) => logger.error({ err }, 'Redis Client Error'));

    await client.connect();
    // logger.info(" Connected!");

    // Search for Refresh Tokens
    // logger.info(" Searching for Refresh Tokens (Pattern: refresh_Token:*)");
    const keys = await client.keys('refresh_Token:*');

    if (keys.length === 0) {
        // logger.info(" No tokens found. Try logging in first!");
    } else {
        // logger.info(` Found ${keys.length} tokens:`);
        for (const key of keys) {
            const _value = await client.get(key);
            // logger.info(`  Key: ${key}`);
            // logger.info(`  Value (Truncated): ${value?.substring(0, 20)}...`);
        }
    }

    await client.disconnect();
};

checkRedis();
