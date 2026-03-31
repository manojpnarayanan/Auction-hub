import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IDisputeRepository } from "../../../domain/interfaces/IDisputeRepository";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { NotFoundError, ValidationError } from "../../../domain/errors/errors";
import { IReleasePaymentUseCase } from "../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { IResolveDisputeUseCase } from "../Usecase Interfaces/Dispute-Interface/IResolveDisputeUseCase";
import { ResolveDisputeDTO } from '../../dtos/DisputeDTO'
import { ICreateNotificationUseCase } from "../Usecase Interfaces/Notification-Interface/ICreateNotificationUseCase";


@injectable()
export class ResolveDisputeUseCase implements IResolveDisputeUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepo: IAuctionRepository,
        @inject(TYPES.DisputeRepository) private _disputeRepo: IDisputeRepository,
        @inject(TYPES.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(TYPES.ReleasePaymentUseCase) private _releasePaymentUseCase: IReleasePaymentUseCase,
        @inject(TYPES.CreateNotificationUseCase) private _createNotificationUseCase:ICreateNotificationUseCase
    ) { }

    async execute(data: ResolveDisputeDTO): Promise<void> {
        const dispute = await this._disputeRepo.findById(data.disputedId); // Note your DTO uses disputedId
        if (!dispute) throw new NotFoundError("Dispute not found");

        if (dispute.status !== 'open' && dispute.status !== 'under_review') {
            throw new ValidationError(`Dispute is already resolved (status: ${dispute.status})`);
        }

        const auction = await this._auctionRepo.findById(dispute.auctionId);
        if (!auction) throw new NotFoundError("Auction not found");

        const adminId = process.env.ADMIN_WALLET_USER_ID!;

        if (data.resolution === 'refund') {
            // 1. REFUND FLOW: Return money from admin escrow directly to buyer
            const pendingTransactions = await this._walletRepo.getPendingRelease(adminId);
            const escrowTx = pendingTransactions.find(tx => tx.auctionId?.toString() === auction.id && tx.userId === adminId);

            if (!escrowTx) throw new Error("Escrow transaction not found! Cannot process refund.");

            // Debit Admin Wallet
            await this._walletRepo.debit(adminId, escrowTx.amount);

            // Credit Buyer Wallet
            await this._walletRepo.credit(dispute.buyerId, escrowTx.amount);

            // Record Refund Transactions
            const adminWallet = await this._walletRepo.findByUserId(adminId);
            const buyerWallet = await this._walletRepo.findByUserId(dispute.buyerId);

            await this._walletRepo.createTransactions({
                userId: adminId,
                walletId: adminWallet!.id,
                amount: escrowTx.amount,
                type: 'debit',
                status: 'completed',
                purpose: 'auction_payment', // Refunding the escrow
                auctionId: auction.id!,
                description: `Refund processed to buyer for disputed auction ${auction.id}`,
                isReleased: true
            });

            await this._walletRepo.createTransactions({
                userId: dispute.buyerId,
                walletId: buyerWallet!.id,
                amount: escrowTx.amount,
                type: 'credit',
                status: 'completed',
                purpose: 'auction_payment',
                auctionId: auction.id!,
                description: `Refund received for disputed auction ${auction.id}`
            });

            // Mark original escrow transaction as released to close the loop
            await this._walletRepo.markTransactionAsReleased(escrowTx.id!);

            // Update statuses
            await this._disputeRepo.updateStatus(dispute.id!, 'resolved_refunded', data.adminNote);
            await this._auctionRepo.update(auction.id!, { deliveryStatus: 'disputed' }); // remains disputed forever
            await this._createNotificationUseCase.execute({
                userId:dispute.buyerId,
                title:"Dispute Resolved",
                message:"Admin has reviewed and processed refund to your Wallet",
                type:'success',
                link:"/user/wallet"
            });
            await this._createNotificationUseCase.execute({
                userId:dispute.sellerId,
                title:"Dispute Resolved",
                message:"Admin has reviewed and processed refund to your buyers Wallet",
                type:'error',
                link:"/user/my-listings"
            });

        } else if (data.resolution === 'reject') {
            // 2. REJECT FLOW: Dispute is rejected, admin sides with seller. Release funds!
            const pendingTransactions = await this._walletRepo.getPendingRelease(adminId);
            const escrowTx = pendingTransactions.find(tx => tx.auctionId?.toString() === auction.id && tx.userId === adminId);

            if (!escrowTx) throw new Error("Escrow transaction not found! Cannot release funds.");

            // Call ReleasePaymentUseCase to pay the seller normally
            await this._releasePaymentUseCase.execute({
                auctionId: auction.id!,
                sellerId: auction.sellerId,
                amount: escrowTx.amount,
                transactionId: escrowTx.id!,
                commissionPercent: 0,
                sellerAmount: 0
            });

            // Update statuses
            await this._disputeRepo.updateStatus(dispute.id!, 'resolved_rejected', data.adminNote);
            await this._auctionRepo.update(auction.id!, { deliveryStatus: 'delivered' }); // mark delivered since dispute failed
            await this._createNotificationUseCase.execute({
                userId:dispute.buyerId,
                title:"Dispute Resolved",
                message:"Admin has reviewed your dispute and rejected the claim. The funds have been released to Seller",
                type:'error',
                link:'/user/my-bids'
            });
            await this._createNotificationUseCase.execute({
                userId:auction.sellerId,
                title:"Paymnent Released",
                message:"The dispute was rejected and Payment was released",
                type:'success',
                link:'/user/wallet'
            });
        }
    }
}
