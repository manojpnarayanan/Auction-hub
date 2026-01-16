import { Request ,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../../infrastructure/config/environment";
import { HttpStatus } from "../../Enums/StatusCodes";




export const authenticate=(req:Request, res:Response, next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:"Access Denied, No token provided" })
        }
        const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(token,config.jwtSecret);
        (req as any).user=decoded;
        next();
    }catch(Error){
        return res.status(HttpStatus.UNAUTHORIZED).json({success:false,message:"Invalid or Expired token"})
    }
}