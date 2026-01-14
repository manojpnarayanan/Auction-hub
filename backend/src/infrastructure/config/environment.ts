import dotenv from "dotenv";

dotenv.config();


interface Config {
    port: number;
    mongoUrl: string;
    jwtSecret: string;
    jwtExpiry: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiry: string;
    corsOrigin: string;
    nodeEnv: string;
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    redisUrl: string;
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


export const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUrl: process.env.MONGO_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiry: process.env.JWT_EXPIRY || '15m',
    jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET!,
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/user/auth/google/callback'
    },
    redisUrl: process.env.REDIS_URL!
};
