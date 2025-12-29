import {createClient} from "redis";
import { config } from "../config/environment";


const redisClient= createClient({url:config.redisUrl});

redisClient.on('error' ,(err)=>console.log("Redis client Error",err));
redisClient.on('connect',()=>console.log("Redis connected to Cloud"));

export const connectRedis= async ()=>{
    try{
        await redisClient.connect();
    }catch(error){
        console.error("Failed to connect to Redis Cloud")
    }
}
export default redisClient