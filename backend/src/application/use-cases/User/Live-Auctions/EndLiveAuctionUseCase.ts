import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { ISocketService } from "../../../../domain/interfaces/ISocketService";
import { IEndLiveAuctionUseCase } from "../../Usecase Interfaces/live-Auctions/IEndLiveAuctionUseCase";
import { NotFoundError,ForbiddenError,ValidationError } from "../../../../domain/errors/errors";



@injectable()
export class EndLiveAuctionUseCase implements IEndLiveAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,
        @inject (TYPES.SocketService) private _socketService:ISocketService
    ){}
    async execute(auctionId: string, hostId: string): Promise<void> {
        const auction=await this._auctionRepository.findById(auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        if(auction.sellerId !== hostId)throw new ForbiddenError("Only the seller can end this Auction");
        if(auction.type !== 'live') throw new ValidationError("Auction is not currently active");

        const finalStatus=auction.bids.length >0 ? 'sold':'expired';
        const winnerId=auction.bids.length >0 ? auction.winnerId : undefined;
        if(finalStatus==='sold'){
            auction.endDate=new Date();
        }
        await this._auctionRepository.updateAuctionStatus(auctionId,finalStatus,winnerId);
        this._socketService.emit("auction_ended",{
            auctionId,
            status:finalStatus,
            winnerId,
            finalPrice:auction.currentPrice,
        },auctionId);
    }
}