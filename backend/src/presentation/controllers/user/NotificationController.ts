import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetNotificationUseCase } from "../../../application/use-cases/Usecase Interfaces/Notification-Interface/IGetNotificationUseCase";
import { IMarkNotificationReadUseCase } from "../../../application/use-cases/Usecase Interfaces/Notification-Interface/IMarkNotificationReadUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { ApiResponse } from "../../Common/APIResponse";
import { CustomMessages } from "../../Enums/CustomMessages";

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
                res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED));
                return;
            }
            const notifications=await this._getNotificationUseCase.execute(fetchId);
            res.status(HttpStatus.OK).json(ApiResponse.success(notifications, CustomMessages.NOTIFICATIONS_FETCHED));
        }catch(error){
            next(error);
        }
    }
    markAsRead=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            await this._markNotificationReadUseCase.execute(id);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.NOTIFICATIONS_MARKED_READ))
        }catch(error){
            next(error);
        }
    }
}