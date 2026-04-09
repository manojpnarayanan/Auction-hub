import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types';
import logger from "../../../../infrastructure/Global/Logger";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { Wallet } from "../../../../domain/entities/Wallet.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { releasePaymentDTO } from "../../../dtos/WalletDTO";
import { IReleasePaymentUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { IEventEmitter } from "../../../../domain/interfaces/IEventEmitter";
import { PaymentReleaseEvent } from "../../../../domain/events/PaymentEvents";
import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import { ValidationError } from "../../../../domain/errors/errors";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";

@injectable()
export class ReleasePaymentUseCase implements IReleasePaymentUseCase {
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.EventEmitter)private _eventEmitter:IEventEmitter,
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
        @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        @inject(TYPES.UserRepository) private _userRepo:IUserRepository,
        @inject (TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository
    ) { }

    async execute(data: releasePaymentDTO): Promise<void> {

        // const isAlreadyReleased=await this._walletRepository.isTransactionReleased(data.transactionId);
        // if(isAlreadyReleased){
        //     logger.warn(`Transaction for this auction is already released. Check again before forwarding`);
        //     return;
        // }
        const wasClaimed=await this._walletRepository.isTransactionReleased(data.transactionId);
        console.log("Release Payment",wasClaimed)
        if(!wasClaimed){
            throw new ValidationError(`Payout already in progress or completed.Please check again`);
            return;
        }
        logger.info(data, "Processing payout");
        logger.info(data, "Execute start");

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
        const commission = Math.round(data.amount * (percent/100));
        const sellerAmount = data.amount - commission;

        // logger.info("MATH:AMOUNT ",data.amount)
        // logger.info("MATH:percent ",percent)
        // logger.info("MATH:Commission ",commission)
        // logger.info("MATH:SellerAmount ",sellerAmount)

        // 2. Setup Wallet Details
        const admin = await this._userRepo.findAdmin();
        if (!admin) throw new Error("Admin not found");
        const adminId=admin.id;
        let adminWallet = await this._walletRepository.findByUserId(adminId);
        if (!adminWallet) {
            const newAdminWallet = new Wallet("", adminId, 0, 'inr', new Date(), new Date())
            adminWallet = await this._walletRepository.create(newAdminWallet);
        }

        const sellerWallet = await this._walletRepository.findByUserId(data.sellerId);
        if (!sellerWallet) throw new Error("Seller wallet not found!");

        const auction=await this._auctionRepository.findById(data.auctionId as string);
        const title=auction? auction.title :"Unknown Auction";

        await this._walletRepository.debit(adminId, data.amount);
        await this._walletRepository.createTransactions({
            userId: adminId,
            walletId: adminWallet.id,
            amount: data.amount,
            type: 'debit',
            status: 'completed',
            purpose: 'auction_payment',
            auctionId: data.auctionId,
            description: `Full amount released for auction ${title}`,
            isReleased: true
        });

        await this._walletRepository.credit(adminId, commission);
        await this._walletRepository.createTransactions({
            userId: adminId,
            walletId: adminWallet.id,
            amount: commission,
            type: 'credit',
            status: 'completed',
            purpose: 'commission',
            auctionId: data.auctionId,
            description: `Commission (${percent}%) kept from auction ${title}`
        });

        await this._walletRepository.credit(data.sellerId, sellerAmount);
        await this._walletRepository.createTransactions({
            userId: data.sellerId,
            walletId: sellerWallet.id,
            amount: sellerAmount,
            type: 'credit',
            status: 'completed',
            purpose: 'seller_credit',
            auctionId: data.auctionId,
            description: `Auction payout received for ${title}, Total :₹ ${data.amount}, Commission:₹${commission}`
        });
        

        // logger.info("2. Calling markTransactions", data.transactionId);
        // 3. Mark the original Escrow as Released
        await this._walletRepository.markTransactionAsReleased(data.transactionId);
        this._eventEmitter.dispatch(new PaymentReleaseEvent(
            data.auctionId!,
            title,
            data.sellerId,
            data.buyerId,
            data.amount,
            commission,
            data.isAutomatic || false
        ));
    }
}
