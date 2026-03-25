import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IDisputeRepository } from "../../../domain/interfaces/IDisputeRepository";
import { IRaiseDisputeUseCase } from "../Usecase Interfaces/Dispute-Interface/IRaiseDisputeUseCase";
import { RaiseDisputeDTO } from "../../dtos/DisputeDTO";
import { Dispute } from "../../../domain/entities/Dispute.entity";
import { ValidationError, NotFoundError } from "../../../domain/errors/errors";

@injectable()
export class RaiseDisputeUseCase implements IRaiseDisputeUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepo: IAuctionRepository,
        @inject(TYPES.DisputeRepository) private _disputeRepo: IDisputeRepository
    ) { }
    async execute(data: RaiseDisputeDTO): Promise<void> {
        const auction = await this._auctionRepo.findById(data.auctionId);
        if (!auction) throw new NotFoundError("Auction not found");
        if (auction.winnerId !== data.buyerId) throw new ValidationError("Only the winning buyer can raise a dispute");
        if (auction.paymentStatus !== 'completed') throw new ValidationError("Payment must be completed gefore raising a dispute");
        if (auction.deliveryStatus !== 'pending_delivery') throw new ValidationError("Cannot raise a dispute .Current delivery status is not congirmed");
        const existingDispute = await this._disputeRepo.findByAuctionId(data.auctionId);
        if (existingDispute) throw new ValidationError("A dispute has already beenm raised");

        const newDispute = new Dispute(
            data.auctionId,
            data.buyerId,
            auction.sellerId,
            data.reason,
            'open'
        );
        await this._disputeRepo.create(newDispute);
        await this._auctionRepo.update(data.auctionId, { deliveryStatus: 'disputed' });
    }
}