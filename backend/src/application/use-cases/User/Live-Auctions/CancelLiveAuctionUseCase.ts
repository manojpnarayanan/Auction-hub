import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { ISocketService } from "../../../../domain/interfaces/ISocketService";
import { NotFoundError,ForbiddenError,ValidationError } from "../../../../domain/errors/errors";
import { ICancelLiveAuctionUseCase } from "../../Usecase Interfaces/live-Auctions/ICancelLiveAuctionUseCase";
import { IEventEmitter } from "../../../../domain/interfaces/IEventEmitter";
import { AuctionCancelledEvent } from "../../../../domain/events/AuctionEvents";


@injectable()
export class CancelLiveAuctionUseCase implements ICancelLiveAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,
        @inject(TYPES.SocketService) private _socketService:ISocketService,
        @inject (TYPES.EventEmitter) private _eventEmitter:IEventEmitter
    ){}
    async execute(auctionId: string, requestId: string, isAdmin: boolean,reason?:string): Promise<void> {
        const auction=await this._auctionRepository.findById(auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        if(!isAdmin){
            throw new ForbiddenError("Only admin can cancel live auctions")
        }
        if(auction.type !== 'live')throw new ValidationError("This is not a live Auction");
        if(auction.status !== 'active') throw new ValidationError("Only active auctions can be cancelled");

        await this._auctionRepository.updateAuctionStatus(auctionId,'cancelled',undefined,undefined,reason);

        this._eventEmitter.dispatch(new AuctionCancelledEvent(
            auctionId,
            "This auction has been cancelled by the admin"
        ))

    }
}