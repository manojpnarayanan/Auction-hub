import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { BidPlacedEvent } from "../../domain/events/AuctionEvents";
import { ISocketService } from "../../domain/interfaces/ISocketService";
import { EventEmitter } from "events";

@injectable()
export class BidListener {
    constructor(
        @inject(TYPES.EventEmitter) private _eventEmitter: EventEmitter,
        @inject(TYPES.SocketService) private _socketService: ISocketService
    ) {
        this.init();
    }

    private init(): void {
        this._eventEmitter.on('BidPlacedEvent', (event: BidPlacedEvent) => {
            this.handleBidPlaced(event);
        });
    }

    private handleBidPlaced(event: BidPlacedEvent): void {
        console.log(`[BidListener] Handling bid for auction: ${event.auctionId}`);
        
        this._socketService.emit('bid_update', {
            auctionId: event.auctionId,
            newPrice: event.amount,
            bid: {
                bidderId: event.bidderId,
                amount: event.amount,
                time: event.time,
                bidderName: event.bidderName,
            },
        }, event.auctionId);
    }
}
