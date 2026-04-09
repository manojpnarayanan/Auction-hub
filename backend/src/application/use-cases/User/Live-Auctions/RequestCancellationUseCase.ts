import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types'
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { IEventEmitter } from "../../../../domain/interfaces/IEventEmitter";
import { AuctionCancellationRequestEvent } from "../../../../domain/events/AuctionEvents";
import { IRequestCancellationUseCase } from "../../Usecase Interfaces/live-Auctions/IRequestCancellationUseCase";
import { NotFoundError } from "../../../../domain/errors/errors";


@injectable()
export class RequestCancellationUseCase implements IRequestCancellationUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.EventEmitter) private _eventEmitter: IEventEmitter
    ) { }
    async execute(auctionId: string, sellerId: string, reason: string): Promise<void> {
        const auction = await this._auctionRepository.findById(auctionId);
        if (!auction) throw new NotFoundError("Auction not found");
        if (auction.sellerId !== sellerId) throw new Error("You are not the owner of this auction");
        
        await this._auctionRepository.updateAuctionStatus(auctionId, 'pending_cancellation', undefined, undefined, reason);

        this._eventEmitter.dispatch(new AuctionCancellationRequestEvent(auctionId, sellerId, reason,auction.title))

    }
}