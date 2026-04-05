import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { ICreateSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/ICreateSubscriptionPlanUseCase";
import { IGetAllSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IGetAllSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IUpdateSubscriptionPlanUseCase";
import { IDeleteSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IDeleteSubscriptionPlanUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { CustomMessages } from "../../Enums/CustomMessages";
import { ApiResponse } from "../../Common/APIResponse";


@injectable()

export class SubscriptionPlanController{
    constructor(
        @inject(TYPES.CreateSubscriptionPlanUseCase)private _createSubscriptionPlan:ICreateSubscriptionPlanUseCase,
        @inject(TYPES.GetAllSubscriptionPlanUseCase) private _getAllSubscriptionPlan:IGetAllSubscriptionPlanUseCase,
        @inject(TYPES.UpdateSubscriptionPlanUseCase)private _updateSubcriptionPlan:IUpdateSubscriptionPlanUseCase,
        @inject(TYPES.DeleteSubscriptionPlanUseCase)private _deleteSubscriptionPlan:IDeleteSubscriptionPlanUseCase
    ){}
    create=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._createSubscriptionPlan.execute(req.body);
            res.status(HttpStatus.CREATED).json(ApiResponse.success(result, CustomMessages.PLAN_CREATED))
        }catch(error){
            next(error)
        }
    }
    getAll=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._getAllSubscriptionPlan.execute();
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.PLANS_FETCHED));
        }catch(error){
            next(error);
        }
    }
    update=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this._updateSubcriptionPlan.execute(req.params.id,req.body);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.PLAN_UPDATED));
        }catch(error){
            next(error)
        }
    }
    delete=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await this._deleteSubscriptionPlan.execute(req.params.id);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.PLAN_DELETED));
        }catch(error){
            next(error);
        }
    }
}