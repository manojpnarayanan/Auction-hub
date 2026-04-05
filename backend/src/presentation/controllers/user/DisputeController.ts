import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IConfirmDeliveryUseCase } from "../../../application/use-cases/Usecase Interfaces/Auction-Interface/IConfirmDeliveryUseCase";
import { IRaiseDisputeUseCase } from "../../../application/use-cases/Usecase Interfaces/Dispute-Interface/IRaiseDisputeUseCase";
import { IResolveDisputeUseCase } from "../../../application/use-cases/Usecase Interfaces/Dispute-Interface/IResolveDisputeUseCase";
import { IGetDisputeUseCase } from "../../../application/use-cases/Usecase Interfaces/Dispute-Interface/IGetDisputeUseCase";
import { RaiseDisputeDTO,ResolveDisputeDTO } from "../../../application/dtos/DisputeDTO";
import { HttpStatus } from "../../Enums/StatusCodes";
import { ApiResponse } from "../../Common/APIResponse";
import { CustomMessages } from "../../Enums/CustomMessages";


@injectable()
export class Disputecontroller{
    constructor(
        @inject(TYPES.ConfirmDeliveryUseCase)private _confirmDeliveryUseCase:IConfirmDeliveryUseCase,
        @inject(TYPES.RaiseDisputeUseCase) private _raiseDisputeUseCase:IRaiseDisputeUseCase,
        @inject(TYPES.ResolveDisputeUseCase) private _resolveDisputeUseCase:IResolveDisputeUseCase,
        @inject(TYPES.GetDisputeUseCase) private _getDisputeUseCase:IGetDisputeUseCase
    ){}
    ConfirmDelivery=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {auctionId} = req.body;
            const buyerId=req.user!.id;
            await this._confirmDeliveryUseCase.execute(auctionId,buyerId);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.DELIVERY_CONFIRMED))
        }catch(error){
            next(error);
        }
    }
    raiseDispute=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const buyerId=req.user!.id;
            const data:RaiseDisputeDTO= {...req.body,buyerId};
            await this._raiseDisputeUseCase.execute(data);
            res.status(HttpStatus.CREATED).json( ApiResponse.ok(CustomMessages.DISPUTE_RAISED));
        }catch(error){
            next(error);
        }
    }
    getBuyerDisputes=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const buyerId=req.user!.id;
            const page=parseInt(req.query.page as string) || 1;
            const limit=parseInt(req.query.limit as string) || 10;
            const result=await this._getDisputeUseCase.getBuyerDisputes(buyerId,page,limit);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.DISPUTES_FETCHED))
        }catch(error){
            next(error);
        }
    }

    getAllDisputes=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const page=parseInt(req.query.page as string)||1;
            const limit=parseInt(req.query.limit as string)||10;
            const status=req.query.status as string;
            const result=await this._getDisputeUseCase.getAllDisputes(page,limit,status);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.DISPUTES_FETCHED))
        }catch(error){
            next(error)
        }
    }

    resolveDispute=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {disputedId}=req.params;
            const resolutionData:ResolveDisputeDTO = {...req.body,disputedId:disputedId}
            await this._resolveDisputeUseCase.execute(resolutionData);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.DISPUTE_RESOLVED))
        }catch(error){
            next(error)
        }
    }
}