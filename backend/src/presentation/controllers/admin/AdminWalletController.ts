import { Request,Response , NextFunction } from "express";
import { injectable,inject } from "inversify";
import {TYPES } from '../../../di/types';
import { IReleasePaymentUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { IGetPendingReleaseUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IGetPendingUseCase";
import { ApiResponse } from "../../Common/APIResponse";
import { CustomMessages } from "../../Enums/CustomMessages";


@injectable()
export class AdminPaymentController{
    constructor(
        @inject(TYPES.ReleasePaymentUseCase) private _releasePaymentUseCase:IReleasePaymentUseCase,
        @inject(TYPES.GetPendingReleaseUseCase) private _getPendingReleaseUseCase:IGetPendingReleaseUseCase,

    ){}
    releasePayment=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            await this._releasePaymentUseCase.execute(req.body);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.PAYMENT_RELEASED));
        }catch(error){
            next(error);
        }
    }
    getPendingRelease=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const result=await this._getPendingReleaseUseCase.execute();
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.PENDING_RELEASE_FETCHED));
        }catch(error){
            next(error);
        }
    }
}