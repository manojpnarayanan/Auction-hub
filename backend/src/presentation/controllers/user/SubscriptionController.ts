import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetSubscriptionUseCase } from "../../../application/use-cases/Usecase Interfaces/Subscription-Interface/IGetSubscriptionUseCase";
import { ISubscribePlanUseCase } from "../../../application/use-cases/Usecase Interfaces/Subscription-Interface/ISubcribePlanUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { SubscribePlanDTO } from "../../../application/dtos/SubscriptionDTO";
import { ICreateSubscriptionPaymentIntentUseCase } from "../../../application/use-cases/Usecase Interfaces/Subscription-Interface/ICreateSubscriptionPaymentIntentUseCase";
import { IConfirmSubscriptionPaymentUseCase } from "../../../application/use-cases/Usecase Interfaces/Subscription-Interface/IConfirmSubscriptionPaymentUseCase";
import { ApiResponse } from "../../Common/APIResponse";
import { CustomMessages } from "../../Enums/CustomMessages";

@injectable()
export class SubscriptionController {
    constructor(
        @inject (TYPES.GetSubscriptionUseCase) private _getSubscriptionUseCase:IGetSubscriptionUseCase,
        @inject(TYPES.SubscribePlanUseCase) private _subscribePlanUseCase:ISubscribePlanUseCase,
        @inject(TYPES.CreateSubscriptionPaymentIntentUseCase) private _createSubscriptionPaymentIntentUseCase:ICreateSubscriptionPaymentIntentUseCase,
        @inject(TYPES.ConfirmSubscriptionPaymentUseCase) private _confirmSubscriptionPaymentUseCase:IConfirmSubscriptionPaymentUseCase,
    ){}
    getSubscription=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._getSubscriptionUseCase.execute(req.user!.id);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.SUBSCRIPTION_FETCHED));
        }catch(error){
            next(error);
        }
    };
    subscribe=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {plan,planId}=req.body;
            if(!['basic','premium'].includes(plan)){
                res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(CustomMessages.INVALID_PLAN));
                return;
            }
            const dto:SubscribePlanDTO={userId:req.user!.id,planId,plan}
            const result=await this._subscribePlanUseCase.execute(dto);
            res.status(HttpStatus.CREATED).json(ApiResponse.success(result, CustomMessages.SUBSCRIPTION_CREATED));
        }catch(error){
            next(error);
        }
    }
    
    createPaymentIntent=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {planId,planName}=req.body;
            if(!planId || !planName){
                res.status(HttpStatus.BAD_REQUEST).json( ApiResponse.error(CustomMessages.PLAN_ID_NAME_REQUIRED));
                return;
            }
            const result=await this._createSubscriptionPaymentIntentUseCase.execute(req.user!.id,planId,planName);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.PAYMENT_INTENT_CREATED));
        }catch(error){
            next(error);
        }
    }
    confirmPayment=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {paymentIntentId,planId,planName}=req.body;
            if(!paymentIntentId || !planId || !planName){
                res.status(HttpStatus.BAD_REQUEST).json( ApiResponse.error(CustomMessages.PAYMENT_INTENT_REQUIRED));
                return;
            }
            const result=await this._confirmSubscriptionPaymentUseCase.execute(
                req.user!.id,
                paymentIntentId,
                planId,
                planName
            );
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.SUBSCRIPTION_ACTIVATED));
        }catch(error){
            next(error)
        }
    }
}