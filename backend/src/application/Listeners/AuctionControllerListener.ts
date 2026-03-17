import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { ISocketService } from "../../domain/interfaces/ISocketService";
import { ICacheService } from "../../domain/interfaces/ICacheService";
import { EventEmitter } from "events";
import { AuctionStartedEvent, AuctionEndedEvent, AuctionCancelledEvent } from "../../domain/events/AuctionEvents";

@injectable()
export class AuctionControlListener {
    constructor(
        @inject(TYPES.EventEmitter) private _eventEmitter: EventEmitter,
        @inject(TYPES.SocketService) private _socketService: ISocketService,
        @inject (TYPES.CacheService) private _cacheService:ICacheService
    ) {
        this.init();
    }

    private init(): void {
        
        this._eventEmitter.on('AuctionStartedEvent', async (event: AuctionStartedEvent) => {
            
            // initital time itself we store starting price to Redis  in key value format;
            await this._cacheService.setNX(`auction:${event.auctionId}:price`,event.currentPrice);
            
            this._socketService.emit('auction_started', {
                auctionId: event.auctionId,
                startTime: event.startTime,
                currentPrice: event.currentPrice
            }, event.auctionId);
        });

        this._eventEmitter.on('AuctionEndedEvent', async (event: AuctionEndedEvent) => {

            await this._cacheService.delete(`auction:${event.auctionId}:price`);

            this._socketService.emit("auction_ended", {
                auctionId: event.auctionId,
                status: event.status,
                winnerId: event.winnerId,
                finalPrice: event.finalPrice,
            }, event.auctionId);
        });

        this._eventEmitter.on('AuctionCancelledEvent', async (event: AuctionCancelledEvent) => {
           
            await this._cacheService.delete(`auction:${event.auctionId}:price`);
           
            this._socketService.emit('auction_cancelled', {
                auctionId: event.auctionId,
                message: event.message
            }, event.auctionId);
        });
    }
}
