import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { ISocketService } from "../../../../domain/interfaces/ISocketService";
import { NotFoundError,ForbiddenError,ValidationError } from "../../../../domain/errors/errors";
import { ICancelLiveAuctionUseCase } from "../../Usecase Interfaces/live-Auctions/ICancelLiveAuctionUseCase";


@injectable()
export class CancelLiveAuctionUseCase implements ICancelLiveAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,
        @inject(TYPES.SocketService) private _socketService:ISocketService
    ){}
    async execute(auctionId: string, requestId: string, isAdmin: boolean): Promise<void> {
        const auction=await this._auctionRepository.findById(auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        if(!isAdmin){
            throw new ForbiddenError("Only admin can cancel live auctions")
        }
        if(auction.type !== 'live')throw new ValidationError("This is not a live Auction");
        if(auction.status !== 'active') throw new ValidationError("Only active auctions can be cancelled");

        await this._auctionRepository.updateAuctionStatus(auctionId,'cancelled');
        this._socketService.emit('auction_cancelled',{
            auctionId,
            message:"This auction has been cancellec by the admin"
        },auctionId);

    }
}