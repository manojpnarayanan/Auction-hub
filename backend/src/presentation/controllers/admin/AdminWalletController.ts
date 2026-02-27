import { Request,Response , NextFunction } from "express";
import { injectable,inject } from "inversify";
import {TYPES } from '../../../di/types';
import { IReleasePaymentUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";



@injectable()
export class AdminPaymentController{
    constructor(
        @inject(TYPES.ReleasePaymentUseCase) private releasePaymentUseCase:IReleasePaymentUseCase
    ){}
    releasePayment=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            await this.releasePaymentUseCase.execute(req.body);
            res.status(HttpStatus.OK).json({message:"Payment released to seller"});
        }catch(error){
            next(error);
        }
    }
}