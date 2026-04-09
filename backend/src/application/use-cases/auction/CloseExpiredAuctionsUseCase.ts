import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { ICloseExpiredAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";
import { IEventEmitter } from "../../../domain/interfaces/IEventEmitter";
import { AuctionEndedEvent } from "../../../domain/events/AuctionEvents";


@injectable()
export class CloseExpiredAuctionUseCase implements ICloseExpiredAuctionUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.EventEmitter)private _eventEmitter:IEventEmitter 
    ) { }
    async execute(): Promise<void> {

        const expiredAuctions = await this._auctionRepository.findExpiredActiveAuctions();
        //  logger.info(`[Cron] found ${expiredAuctions.length} expired Auctions`);
        for (const auction of expiredAuctions) {
            if (auction.bids && auction.bids.length > 0) {
                const highestBid = auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max)
                await this._auctionRepository.updateAuctionStatus(auction.id!, 'sold', highestBid.bidderId);
                // logger.info(`[Cron ] Auction ${auction.id} marked as SOLD to ${highestBid.bidderId}`);
                this._eventEmitter.dispatch(new AuctionEndedEvent(auction.id!,'sold',highestBid.bidderId,highestBid.amount,auction.title));
            } else {
                await this._auctionRepository.updateAuctionStatus(auction.id!, 'expired');
                // logger.info(`[Cron] Auction ${auction.id} marked as Expired`);
                this._eventEmitter.dispatch(new AuctionEndedEvent(auction.id!,'expired',undefined,auction.currentPrice,auction.title));
            }
        }
    }
}