import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetNotificationUseCase } from "../../../application/use-cases/Usecase Interfaces/Notification-Interface/IGetNotificationUseCase";
import { IMarkNotificationReadUseCase } from "../../../application/use-cases/Usecase Interfaces/Notification-Interface/IMarkNotificationReadUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";


@injectable()
export class NotificationController{
    constructor(
        @inject(TYPES.GetNotificationUseCase) private _getNotificationUseCase:IGetNotificationUseCase,
        @inject(TYPES.MarkNotificationReadUseCase) private _markNotificationReadUseCase:IMarkNotificationReadUseCase,
    ){}

    getNotification=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const fetchId=req.user!.id;
            if(!fetchId){
                res.status(HttpStatus.UNAUTHORIZED).json({success:false,message:"Unauthorized"});
                return;
            }
            const notifications=await this._getNotificationUseCase.execute(fetchId);
            res.status(HttpStatus.OK).json({success:true,data:notifications});
        }catch(error){
            next(error);
        }
    }
    markAsRead=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            await this._markNotificationReadUseCase.execute(id);
            res.status(HttpStatus.OK).json({success:true,message:"Marked as Read"})
        }catch(error){
            next(error);
        }
    }
}