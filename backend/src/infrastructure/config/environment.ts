import dotenv from "dotenv";

dotenv.config();


interface Config {
    port: number;
    mongoUrl: string;
    jwtSecret: string;
    jwtExpiry: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiry: string;
    corsOrigin: string | string[] ;
    nodeEnv: string;
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    redisUrl: string;
    stripeSecretKey: string;
    stripePublishKey: string;
    stripeWebhook: string;
    redisCacheTtl: number;
}


const requiredEnvVars =
    ['MONGO_URL',
        'JWT_SECRET',
        "REFRESH_TOKEN_SECRET",
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'REDIS_URL'];


for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const allowedOrigins=process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o=>o.trim()):['http://localhost:5173']
if(!allowedOrigins.includes('http://localhost:5173')){
    allowedOrigins.push('http://localhost:5173');
}

export const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUrl: process.env.MONGO_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiry: process.env.JWT_EXPIRY || '15m',
    jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET!,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
    corsOrigin: allowedOrigins,
    nodeEnv: process.env.NODE_ENV || 'development',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/user/auth/google/callback'
    },
    redisUrl: process.env.REDIS_URL!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripePublishKey: process.env.STRIPE_PUBLISH_KEY!,
    stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET!,
    redisCacheTtl: parseInt(process.env.REDIS_CACHE_TTL || '3600', 10)
};
