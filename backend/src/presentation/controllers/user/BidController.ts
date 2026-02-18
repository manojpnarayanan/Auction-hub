import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IPlaceBidUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IPlaceBidUseCase";
import { IGetAuctionBidsUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IGetAuctionBidsUseCase";
import { IGetUserBidsUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IGetUserBidsUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { success } from "zod";


@injectable()

export class BidController {
    constructor(
        @inject(TYPES.PlaceBidUseCase) private placeBidUseCase: IPlaceBidUseCase,
        @inject(TYPES.GetAuctionBidsUseCase) private getAuctionBidsUseCase: IGetAuctionBidsUseCase,
        @inject(TYPES.GetUserBidUseCase) private getUserBidUseCase: IGetUserBidsUseCase
    ) { }
    async placeBid(req: Request, res: Response, next: NextFunction) {
        try {
            const { auctionId, amount } = req.body;
            const bidderId = (req.user as any)?.id;
            if (!bidderId) return res.status(401).json({ success: false, message: "Unauthorized" });
            const bid = await this.placeBidUseCase.execute({ auctionId, bidderId, amount });

            res.status(201).json({
                success: true,
                message: "Bid placed Successsfully",
                data: bid
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getBids(req: Request, res: Response, next: NextFunction) {
        try {
            const { auctionId } = req.params;
            const bids = await this.getAuctionBidsUseCase.execute(auctionId);
            res.status(200).json({ success: true, data: bids });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }
    async getMyBids(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req.user as any)?.id;
            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "unAuthorized" });
            }
            const bids = await this.getUserBidUseCase.execute(userId);
            res.status(HttpStatus.OK).json({ success: true, data: bids });
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
}