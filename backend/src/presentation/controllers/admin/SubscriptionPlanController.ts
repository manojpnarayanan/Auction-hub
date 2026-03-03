import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { ICreateSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/ICreateSubscriptionPlanUseCase";
import { IGetAllSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IGetAllSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IUpdateSubscriptionPlanUseCase";
import { IDeleteSubscriptionPlanUseCase } from "../../../application/use-cases/Usecase Interfaces/SubscriptionPlan-Interfaces/IDeleteSubscriptionPlanUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";


@injectable()

export class SubscriptionPlanController{
    constructor(
        @inject(TYPES.CreateSubscriptionPlanUseCase)private createSubscriptionPlan:ICreateSubscriptionPlanUseCase,
        @inject(TYPES.GetAllSubscriptionPlanUseCase) private getAllSubscriptionPlan:IGetAllSubscriptionPlanUseCase,
        @inject(TYPES.UpdateSubscriptionPlanUseCase)private updateSubcriptionPlan:IUpdateSubscriptionPlanUseCase,
        @inject(TYPES.DeleteSubscriptionPlanUseCase)private deleteSubscriptionPlan:IDeleteSubscriptionPlanUseCase
    ){}
    create=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this.createSubscriptionPlan.execute(req.body);
            res.status(HttpStatus.CREATED).json(result)
        }catch(error){
            next(error)
        }
    }
    getAll=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this.getAllSubscriptionPlan.execute();
            res.status(HttpStatus.OK).json(result);
        }catch(error){
            next(error);
        }
    }
    update=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const result=await this.updateSubcriptionPlan.execute(req.params.id,req.body);
            res.status(HttpStatus.OK).json(result);
        }catch(error){
            next(error)
        }
    }
    delete=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await this.deleteSubscriptionPlan.execute(req.params.id);
            res.status(HttpStatus.OK).json({message:"Plan deleted Successfully"});
        }catch(error){
            next(error);
        }
    }
}