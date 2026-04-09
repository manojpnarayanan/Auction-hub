import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IAdminAuctionManagamentUseCase } from "../Usecase Interfaces/Admin/IAdminAuctionManagement";
import { IEventEmitter } from "../../../domain/interfaces/IEventEmitter";
import { AuctionApprovedEvent, AuctionRejectedEvent } from "../../../domain/events/AuctionEvents";
import { NotFoundError } from "../../../domain/errors/errors";



@injectable()

export class ApproveAuctionUseCase implements IAdminAuctionManagamentUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.EventEmitter) private _eventEmitter: IEventEmitter
    ) { }
    async execute(auctionId: string, status: 'active' | 'rejected' | 'cancelled' | 'approved', reason?: string): Promise<void> {

        const auction = await this._auctionRepository.findById(auctionId);
        if (!auction) throw new NotFoundError("Auction not Found");

        await this._auctionRepository.updateAuctionStatus(auctionId, status, undefined, reason);

        if (status === 'rejected' && reason) {
            this._eventEmitter.dispatch(new AuctionRejectedEvent(auctionId, auction.sellerId, reason,auction.title));
        }else if(status==='approved' || status === 'active'){
            this._eventEmitter.dispatch(new AuctionApprovedEvent(auctionId,auction.sellerId,auction.title))
        }
    }
}