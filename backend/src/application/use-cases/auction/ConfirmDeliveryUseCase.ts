import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { IConfirmDeliveryUseCase } from "../Usecase Interfaces/Auction-Interface/IConfirmDeliveryUseCase";
import { IReleasePaymentUseCase } from "../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { ValidationError,NotFoundError } from "../../../domain/errors/errors";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

@injectable()
export class ConfirmDeliveryUseCase implements IConfirmDeliveryUseCase{
    constructor(
        @inject(TYPES.AuctionRepository)private _auctionRepo:IAuctionRepository,
        @inject(TYPES.WalletRepository)private _walletRepo:IWalletRepository,
        @inject(TYPES.ReleasePaymentUseCase) private _releasePaymentUseCase:IReleasePaymentUseCase,
        @inject(TYPES.UserRepository) private _userRepo:IUserRepository
    ){}
    async execute(auctionId: string, buyerId: string): Promise<void> {
        const auction=await this._auctionRepo.findById(auctionId);
        if(!auction) throw new NotFoundError("auction not found");
        if(auction.winnerId!==buyerId) throw new ValidationError("Only the winner buyer can confirm delivery");
        if(auction.paymentStatus !== 'completed') throw new ValidationError("Payment must be completed before confirming delivery");
        if(auction.deliveryStatus !== 'pending_delivery') throw new ValidationError("Cannot confirm Delivery current status is not deliverd"); 

        const admin=await this._userRepo.findAdmin();
        if(!admin ) throw new Error("Admin not found");
        const adminId=admin.id;
        const pendingTransactions=await this._walletRepo.getPendingRelease(adminId);
        const escrowTX=pendingTransactions.find(tx=>tx.auctionId?.toString() === auctionId && tx.userId ===adminId );

        if(!escrowTX)throw new ValidationError("Escrow transactions not found");
        auction.deliveryStatus='delivered';
        await this._auctionRepo.update(auctionId,{deliveryStatus:"delivered"});

        await this._releasePaymentUseCase.execute({
            auctionId:auctionId,
            sellerId:auction.sellerId,
            buyerId:buyerId,
            amount:escrowTX.amount,
            transactionId:escrowTX.id!,
            commissionPercent:0,
            sellerAmount:0,
            isAutomatic:false
        })

    }
}