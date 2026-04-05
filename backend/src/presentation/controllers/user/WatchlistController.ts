import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { HttpStatus } from "../../Enums/StatusCodes";
import { ApiResponse } from "../../Common/APIResponse";
import { IAddToWatchlistUseCase } from "../../../application/use-cases/Usecase Interfaces/Watchlist-Interface/IAddToWatchlistUseCase";
import { IRemoveFromWatchlistUseCase } from "../../../application/use-cases/Usecase Interfaces/Watchlist-Interface/IRemoveFromWatchlistUseCase";
import { IGetWatchlistUseCase } from "../../../application/use-cases/Usecase Interfaces/Watchlist-Interface/IGetWatchlistUseCase";
import { ICheckWatchlistUseCase } from "../../../application/use-cases/Usecase Interfaces/Watchlist-Interface/ICheckWatchlistUseCase";
import { CustomMessages } from "../../Enums/CustomMessages";


@injectable()
export class WatchlistController{
    constructor(
        @inject(TYPES.AddToWatchlistUseCase) private _addToWatchlistUSeCase:IAddToWatchlistUseCase,
        @inject(TYPES.RemoveFromWatchlistUseCase) private _removeFromWatchlistUseCase:IRemoveFromWatchlistUseCase,
        @inject(TYPES.GetWatchlistUseCase) private _getWatchlistUseCase:IGetWatchlistUseCase,
        @inject(TYPES.CheckWatchlistUseCase) private _checkWatchlistUseCase:ICheckWatchlistUseCase
    ){}
    addToWatchlist= async (req:Request,res:Response,next:NextFunction)=>{
        
        try{
            const userId=req.user!.id;
            const {auctionId}=req.params;
            await this._addToWatchlistUSeCase.execute(userId,auctionId);
            return res.status(HttpStatus.OK).json(ApiResponse.success(null,CustomMessages.ADDED_TO_WATCHLIST));
        }catch(error){
            next(error)
        }
    }
    removeFromWatchlist=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.user!.id;
            const {auctionId}=req.params;
            await this._removeFromWatchlistUseCase.execute(userId,auctionId);
            return res.status(HttpStatus.OK).json(ApiResponse.success(null,CustomMessages.REMOVED_FROM_WATCHLIST));
        }catch(error){
            next(error)
        }
    }
    getWatchlist=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.user!.id;
            const auctions=await this._getWatchlistUseCase.execute(userId);
            return res.status(HttpStatus.OK).json(ApiResponse.success(auctions,CustomMessages.WATCHLIST_FETCHED));
        }catch(error){
            next(error)
        }
    }
    checkWatchlist=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.user!.id;
            const {auctionId}=req.params;
            const isWatchlisted=await this._checkWatchlistUseCase.execute(userId,auctionId);
            return res.status(HttpStatus.OK).json(ApiResponse.success({isWatchlisted},CustomMessages.WATCHLIST_STATUS_CHECKED));
        }catch(error){
            next(error)
        }
    }
}