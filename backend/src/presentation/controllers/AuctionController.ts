import { injectable,inject } from "inversify";
import { Request,Response,NextFunction } from "express";
import {TYPES} from "../../di/types";
import { ICreateAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { HttpStatus } from "../Enums/StatusCodes";
import { IGetAllListedAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { IGetAllAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";

@injectable()

export class AuctionController{
    constructor(
        @inject(TYPES.CreateAuctionUseCase) private createAuctionUseCase:ICreateAuctionUseCase,
        @inject(TYPES.GetSellerAuctionUseCase) private getAllListedAuctionUseCase:IGetAllListedAuctionUseCase,
        @inject(TYPES.GetAllAuctionsUseCase)private getAllAuctionsUseCase:IGetAllAuctionUseCase,

    ){ }
    create=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const auctionData={
                ...req.body,
                sellerId:(req as any).user.id
            };
            const result=await this.createAuctionUseCase.execute(auctionData);
            res.status(HttpStatus.CREATED).json({success:true, data:result});
        }catch(error){
            next(error);
        }
    }
    getAll=async (req:Request,res:Response, next:NextFunction)=>{
        try{
            const auctions=await this.getAllAuctionsUseCase.execute();
            res.status(HttpStatus.OK).json({success:true,data:auctions});
        }catch(error){
            next(error);
        }
    }
    getMine=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId= (req as any).user.id;
            const auctions=await this.getAllListedAuctionUseCase.execute(userId);
            res.status(HttpStatus.OK).json({success:true, data:auctions})
        }catch(error){
            next(error);
        }
    }
}