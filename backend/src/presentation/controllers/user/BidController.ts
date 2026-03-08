import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IPlaceBidUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IPlaceBidUseCase";
import { IGetAuctionBidsUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IGetAuctionBidsUseCase";
import { IGetUserBidsUseCase } from "../../../application/use-cases/Usecase Interfaces/Bid-interface/IGetUserBidsUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";


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
            if (!bidderId) return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
            const bid = await this.placeBidUseCase.execute({ auctionId, bidderId, amount });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Bid placed Successsfully",
                data: bid
            });
        } catch (error) {
            next(error);
        }
    }
    async getBids(req: Request, res: Response, next: NextFunction) {
        try {
            const { auctionId } = req.params;
            const bids = await this.getAuctionBidsUseCase.execute(auctionId);
            res.status(HttpStatus.OK).json({ success: true, data: bids });
        } catch (error) {
            next(error);
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
        } catch (error) {
            next(error);
        }
    }
}