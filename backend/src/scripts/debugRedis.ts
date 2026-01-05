
import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkRedis = async () => {
    console.log("🔌 Connecting to Redis...");
    const client = createClient({ url: process.env.REDIS_URL });

    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
    console.log("✅ Connected!");

    // Search for Refresh Tokens
    console.log("🔎 Searching for Refresh Tokens (Pattern: refresh_Token:*)");
    const keys = await client.keys('refresh_Token:*');

    if (keys.length === 0) {
        console.log("❌ No tokens found. Try logging in first!");
    } else {
        console.log(`🎉 Found ${keys.length} tokens:`);
        for (const key of keys) {
            const value = await client.get(key);
            console.log(`- 🔑 Key: ${key}`);
            console.log(`  📄 Value (Truncated): ${value?.substring(0, 20)}...`);
        }
    }

    await client.disconnect();
};

checkRedis();
