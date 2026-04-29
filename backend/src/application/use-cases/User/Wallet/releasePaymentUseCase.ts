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
        @inject(TYPES.EventEmitter) private _eventEmitter: IEventEmitter,
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
        @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository
    ) { }

    async execute(data: releasePaymentDTO): Promise<void> {

        
        const wasClaimed = await this._walletRepository.isTransactionReleased(data.transactionId);
        // console.log("Release Payment", wasClaimed)
        if (!wasClaimed) {
            throw new ValidationError(`Payout already in progress or completed.Please check again`);
            return;
        }
        logger.info(data, "Processing payout");
        logger.info(data, "Execute start");
        const sub = await this._subscriptionRepository.findActiveByUSerId(data.sellerId);
        let plan = sub ? await this._subscriptionPlanRepository.findById(sub.planId) : null;

        
        if (!plan) {
            plan = await this._subscriptionPlanRepository.findDefaultPlan();
        }
        // logger.info("PLAN FOUND",plan?{name:plan.name,commission:plan.commission}:"NO PLAN FOUND")

        
        const percent = plan ? plan.commission : 0.06;
        const commission = Math.ceil(data.amount * percent);
        const sellerAmount = data.amount - commission;

        
        const admin = await this._userRepo.findAdmin();
        if (!admin) throw new Error("Admin not found");
        const adminId = admin.id;
        let adminWallet = await this._walletRepository.findByUserId(adminId);
        if (!adminWallet) {
            const newAdminWallet = new Wallet("", adminId, 0, 'inr', new Date(), new Date())
            adminWallet = await this._walletRepository.create(newAdminWallet);
        }

        let sellerWallet = await this._walletRepository.findByUserId(data.sellerId);
        if (!sellerWallet) {
            const newSellerWallet=new Wallet("",data.sellerId,0,'inr',new Date(),new Date());
                sellerWallet=await this._walletRepository.create(newSellerWallet)
        }

        const auction = await this._auctionRepository.findById(data.auctionId as string);
        const title = auction ? auction.title : "Unknown Auction";

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
            userId: data.sellerId,
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
            userId: adminId,
            walletId: sellerWallet.id,
            amount: sellerAmount,
            type: 'credit',
            status: 'completed',
            purpose: 'seller_credit',
            auctionId: data.auctionId,
            description: `Auction payout received for ${title}, Total :₹ ${data.amount}, Commission:₹${commission}`
        });


        // logger.info("2. Calling markTransactions", data.transactionId);
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
