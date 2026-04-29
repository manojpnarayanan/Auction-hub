import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { IEventEmitter } from "../../../../domain/interfaces/IEventEmitter";
import { ISocketService } from "../../../../domain/interfaces/ISocketService";
import { IStartLiveAuctionUseCase } from "../../Usecase Interfaces/live-Auctions/IStartLiveAuctionUseCase";
import { NotFoundError,ForbiddenError,ValidationError } from "../../../../domain/errors/errors";
import { AuctionStartedEvent } from "../../../../domain/events/AuctionEvents";



@injectable()
export class StartLiveAuctionUseCase implements IStartLiveAuctionUseCase{
    constructor(
        @inject (TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,
        @inject (TYPES.SocketService) private _socketService:ISocketService,
        @inject (TYPES.EventEmitter) private _eventEmitter:IEventEmitter
    ){}
    async execute(auctionId: string, hostId: string): Promise<void> {
        const auction=await this._auctionRepository.findById(auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        if(auction.sellerId !== hostId) throw new ForbiddenError("Only the seller can start this Auction");
        if(auction.type !== 'live' )throw new ValidationError('This is not a live auction');
        if (auction.status === 'active')throw new ValidationError("Auction is already live");
        await this._auctionRepository.updateAuctionStatus(auctionId,'active');
        
        this._eventEmitter.dispatch(new AuctionStartedEvent(
            auctionId,
            new Date(),
            auction.currentPrice
        ))
    }
}

