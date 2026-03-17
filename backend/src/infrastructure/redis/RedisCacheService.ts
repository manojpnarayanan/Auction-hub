import { injectable } from "inversify";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import redisClient from "./redisClient";
import { config } from "../config/environment";

@injectable()

export class RedisCacheService implements ICacheService {

    async set(key: string, value: string, ttlSeconds: number = config.redisCacheTtl): Promise<void> {
        await redisClient.set(key, value, { EX: ttlSeconds })
    }

    async get(key: string): Promise<string | null> {
        return await redisClient.get(key)
    }

    async delete(key: string): Promise<void> {
        await redisClient.del(key)
    }

    async setNX(key: string, value: string | number): Promise<boolean> {
        const result=await redisClient.set(key,value.toString(),{
            NX:true
        });
        return result === 'OK'
    }

    async increment(key: string, amount: number): Promise<number> {
        return await redisClient.incrBy(key,amount);    
    }

    async getNumber(key: string): Promise<number | null> {
        const val=await redisClient.get(key);
        return val? parseFloat(val) : null    
    }
}