import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/environment";



export const isUser=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer")){
            const token=authHeader.split(" ")[1];
            const decoded=jwt.verify(token,config.jwtSecret);
            (req as any).user=decoded;
        }
        next();

    }catch(error){
        next();
    }
}