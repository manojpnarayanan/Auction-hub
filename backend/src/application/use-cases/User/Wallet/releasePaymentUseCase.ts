import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types';
import logger from "../../../../infrastructure/Global/Logger";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { Wallet } from "../../../../domain/entities/Wallet.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { releasePaymentDTO } from "../../../dtos/WalletDTO";
import { IReleasePaymentUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";

@injectable()
export class ReleasePaymentUseCase implements IReleasePaymentUseCase {
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        // --- ADD THESE TWO NEW INJECTIONS ---
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
        @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) { }

    async execute(data: releasePaymentDTO): Promise<void> {
        logger.info(data,"Execute start");

        // 1. Fetch REAL commission from seller's active plan (The Security Step)
        const sub = await this._subscriptionRepository.findActiveByUSerId(data.sellerId);
        let plan = sub ? await this._subscriptionPlanRepository.findById(sub.planId) : null;
        
        // If they have no active sub, find the "0 rs" Default Plan
        if (!plan) {
            plan = await this._subscriptionPlanRepository.findDefaultPlan();
        }
        // logger.info("PLAN FOUND",plan?{name:plan.name,commission:plan.commission}:"NO PLAN FOUND")

        // Use plan percent, or fallback to 5% if something goes wrong
        const percent = plan ? plan.commission : 6;
        const commission = Math.round(data.amount * percent);
        const sellerAmount = data.amount - commission;

        // logger.info("MATH:AMOUNT ",data.amount)
        // logger.info("MATH:percent ",percent)
        // logger.info("MATH:Commission ",commission)
        // logger.info("MATH:SellerAmount ",sellerAmount)

        // 2. Setup Wallet Details
        const adminId = process.env.ADMIN_WALLET_USER_ID!;
        if (!adminId) throw new Error("ADMIN_WALLET_USER_ID is missing from .env");
        let adminWallet = await this._walletRepository.findByUserId(adminId);
        if (!adminWallet) {
            const newAdminWallet=new Wallet("",adminId,0,'inr',new Date(),new Date())
            adminWallet = await this._walletRepository.create(newAdminWallet);
        }

        const sellerWallet = await this._walletRepository.findByUserId(data.sellerId);
        if (!sellerWallet) throw new Error("Seller wallet not found!");

        // --- TRANSACTION LOGIC ---

        // A. Debit Admin for the Full Amount
        await this._walletRepository.debit(adminId, data.amount);
        await this._walletRepository.createTransactions({
            userId: adminId,
            walletId: adminWallet.id,
            amount: data.amount,
            type: 'debit',
            status: 'completed',
            purpose: 'auction_payment',
            auctionId: data.auctionId,
            description: `Full amount released for auction ${data.auctionId}`,
            isReleased: true // Mark payout as released immediately
        });

        // B. Credit Admin for the Commission (Using dynamic 'percent')
        await this._walletRepository.credit(adminId, commission);
        await this._walletRepository.createTransactions({
            userId: adminId,
            walletId: adminWallet.id,
            amount: commission,
            type: 'credit',
            status: 'completed',
            purpose: 'commission',
            auctionId: data.auctionId,
            description: `Commission (${percent}%) kept from auction ${data.auctionId}`
        });

        // C. Credit Seller for their share
        await this._walletRepository.credit(data.sellerId, sellerAmount);
        await this._walletRepository.createTransactions({
            userId: data.sellerId,
            walletId: sellerWallet.id,
            amount: sellerAmount,
            type: 'credit',
            status: 'completed',
            purpose: 'seller_credit',
            auctionId: data.auctionId,
            description: `Auction payout received for ${data.auctionId}`
        });

        // logger.info("2. Calling markTransactions", data.transactionId);
        // 3. Mark the original Escrow as Released
        await this._walletRepository.markTransactionAsReleased(data.transactionId);
    }
}
