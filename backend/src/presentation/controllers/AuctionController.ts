import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../di/types";
import { ICreateAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { HttpStatus } from "../Enums/StatusCodes";
import { IGetAllListedAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { IGetAllAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { IGetAuctionDetailsUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { IUpdateAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IUpdateAuctionUseCase";
import { IDeleteAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/IDeleteAuctionUseCase";
import { IAdminAuctionManagamentUseCase } from "../../application/use-cases/Usecase Interfaces/Admin/IAdminAuctionManagement";
import { IStartLiveAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/live-Auctions/IStartLiveAuctionUseCase";
import { IEndLiveAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/live-Auctions/IEndLiveAuctionUseCase";
import { ICancelLiveAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/live-Auctions/ICancelLiveAuctionUseCase";



@injectable()

export class AuctionController {
    constructor(
        @inject(TYPES.CreateAuctionUseCase) private _createAuctionUseCase: ICreateAuctionUseCase,
        @inject(TYPES.GetSellerAuctionUseCase) private _getAllListedAuctionUseCase: IGetAllListedAuctionUseCase,
        @inject(TYPES.GetAllAuctionsUseCase) private _getAllAuctionsUseCase: IGetAllAuctionUseCase,
        @inject(TYPES.GetAuctionDetailsUseCase) private _getAuctionDetails: IGetAuctionDetailsUseCase,
        @inject(TYPES.UpdateAuctionUseCase) private _updateAuctionUseCase: IUpdateAuctionUseCase,
        @inject(TYPES.DeleteAuctionUseCase) private _deleteAuctionUseCase: IDeleteAuctionUseCase,
        @inject(TYPES.ApproveAuctionUseCase) private _approveAuctionsUseCase: IAdminAuctionManagamentUseCase,
        @inject(TYPES.StartLiveAuctionUseCase)private _startLiveAuctionuseCase:IStartLiveAuctionUseCase,
        @inject(TYPES.EndLiveAuctionUseCase) private _endLiveAuctionUseCase:IEndLiveAuctionUseCase,
        @inject(TYPES.CancelLiveAuctionUseCase) private _cancelLiveAuctionUseCase:ICancelLiveAuctionUseCase,

    ) { }
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auctionData = {
                ...req.body,
                sellerId: req.user!.id
            };
            const result = await this._createAuctionUseCase.execute(auctionData);
            res.status(HttpStatus.CREATED).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { category, search, type, status ,page,limit} = req.query;
            const result = await this._getAllAuctionsUseCase.execute(
                category as string, 
                search as string,
                 type as string, 
                 status as string,
                page?Number(page):1,
                limit?Number(limit):10
                );
            res.status(HttpStatus.OK).json({success:true,...result});
        } catch (error) {
            next(error);
        }
    }
    getMine = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const page=parseInt(req.query.page as string);
            const limit=parseInt(req.query.limit as string);
            const auctions = await this._getAllListedAuctionUseCase.execute(userId,page,limit);
            res.status(HttpStatus.OK).json({ success: true, ...auctions })
        } catch (error) {
            next(error);
        }
    }
    getAuctionProductDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const auction = await this._getAuctionDetails.execute(id);
            if (!auction) {
                res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Auction not found" });
                return;
            }
            res.status(HttpStatus.OK).json({ success: true, data: auction });
        } catch (error) {
            next(error);
        }
    }
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updatedAuction = await this._updateAuctionUseCase.execute(id, req.body);
            if (!updatedAuction) {
                res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Auction not found" });
                return;
            }
            res.status(HttpStatus.OK).json({ success: true, data: updatedAuction });
        } catch (error) {
            next(error);
        }
    }
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const success = await this._deleteAuctionUseCase.execute(id);
            if (!success) {
                res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Auction not found" });
                return;
            }
            res.status(HttpStatus.OK).json({ success: true, message: "Auction deleted successfully" })
        } catch (error) {
            next(error);
        }
    }
    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await this._approveAuctionsUseCase.execute(id, status);
            res.status(HttpStatus.OK).json({ success: true, message: `Auction marked as ${status}` })
        } catch (error) {
            next(error);
        }
    }

    startLiveAuction=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            const sellerId=req.user!.id;
            await this._startLiveAuctionuseCase.execute(id,sellerId);
            res.status(HttpStatus.OK).json({success:true,message:"Live auction Started"});
        }catch(error){
            next(error);
        }
    }
    endLiveAuction=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id} =req.params;
            const sellerId=req.user!.id;
            await this._endLiveAuctionUseCase.execute(id,sellerId);
            res.status(HttpStatus.OK).json({success:true,message:"Auction Ended successfully"});
        }catch(error){
            next(error);
        }
    }
    cancelLiveAuction=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id} =req.params;
            const requesterId=req.user!.id;
            const isAdmin=req.user!.role==='admin';
            await this._cancelLiveAuctionUseCase.execute(id,requesterId,isAdmin);
            res.status(HttpStatus.OK).json({success:true,message:"Auction cancelled"});
        }catch(error){
            next(error);
        }
    }

}