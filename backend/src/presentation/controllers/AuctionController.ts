import { injectable,inject } from "inversify";
import { Request,Response,NextFunction } from "express";
import {TYPES} from "../../di/types";
import { ICreateAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { HttpStatus } from "../Enums/StatusCodes";
import { IGetAllListedAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { IGetAllAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { IGetAuctionDetailsUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { IUpdateAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IUpdateAuctionUseCase";


@injectable()

export class AuctionController{
    constructor(
        @inject(TYPES.CreateAuctionUseCase) private createAuctionUseCase:ICreateAuctionUseCase,
        @inject(TYPES.GetSellerAuctionUseCase) private getAllListedAuctionUseCase:IGetAllListedAuctionUseCase,
        @inject(TYPES.GetAllAuctionsUseCase)private getAllAuctionsUseCase:IGetAllAuctionUseCase,
        @inject(TYPES.GetAuctionDetailsUseCase) private getAuctionDetails:IGetAuctionDetailsUseCase,
        @inject(TYPES.UpdateAuctionUseCase) private updateAuctionUseCase:IUpdateAuctionUseCase,


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
            const {category} = req.query;
            const auctions=await this.getAllAuctionsUseCase.execute(category as string);
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
    getAuctionProductDetails=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id} = req.params;
            const auction=await this.getAuctionDetails.execute(id);
            if(!auction){
                res.status(HttpStatus.NOT_FOUND).json({success:false,message:"Auction not found"});
                return;
            }
            res.status(HttpStatus.OK).json({success:true,data:auction});
        }catch(error){
            next(error);
        }
    }
    update=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id} =req.params;
            const updatedAuction=await this.updateAuctionUseCase.execute(id,req.body);
            if(!updatedAuction){
                res.status(HttpStatus.NOT_FOUND).json({success:false,message:"Auction not found"});
                return;
            }
            res.status(HttpStatus.OK).json({success:true,data:updatedAuction});
        }catch(error){
            next(error);
        }
    }

}