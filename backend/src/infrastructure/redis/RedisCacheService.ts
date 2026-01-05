import { injectable } from "inversify";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import redisClient from "./redisClient";

@injectable()

export class RedisCacheService implements ICacheService {

    async set(key:string, value:string,ttlSeconds:number=3600):Promise<void>{
    await redisClient.set(key,value,{EX:ttlSeconds})
    }

    async get(key:string):Promise<string | null>{
        return await redisClient.get(key)
    }

    async del(key:string):Promise<void>{
        await redisClient.del(key)
    }
}