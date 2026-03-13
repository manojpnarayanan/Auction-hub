import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { confirmPaymentDTO } from "../../../dtos/WalletDTO";
import { IconfirmPaymentUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IConfirmPaymentUseCase";
import { ValidationError } from "../../../../domain/errors/errors";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";

@injectable()
export class ConfirmPayment implements IconfirmPaymentUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository,
        @inject (TYPES.PaymentService) private _paymentService:IPaymentService,
        @inject (TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository
    ){}
    async execute(buyerId: string, data: confirmPaymentDTO): Promise<void> {
        // logger.info("Checking payment for Auction:", data.auctionId); // DEBUG LOG
        const intent=await this._paymentService.retrievePaymentIntent(data.paymentIntentId);
        
        // Sometimes Stripe is still 'processing' for a half-second
        if(intent.status !== 'succeeded' && intent.status !== 'processing'){
            throw new ValidationError(`Payment status is ${intent.status}, not succeeded.`);
        }

        const adminId=process.env.ADMIN_WALLET_USER_ID!;
        await this._walletRepository.credit(adminId,intent.amount/100);
        const adminWallet=await this._walletRepository.findByUserId(adminId);
        if(adminWallet){
            await this._walletRepository.createTransactions({
                walletId:adminWallet.id,
                userId:adminId,
                amount:intent.amount/100,
                type:'credit',
                status:'completed',
                purpose:'auction_payment',
                auctionId:data.auctionId,
                stripePaymentIntentId:data.paymentIntentId,
                description:`Payment received for auction ${data.auctionId}`,
                isReleased:false
            });
        }
        await this._walletRepository.updateTransactions(data.paymentIntentId,'completed');
        await this._auctionRepository.updatePaymentStatus(data.auctionId,'completed');
        // logger.info("DATABASE UPDATED SUCCESSFULLY for auction:", data.auctionId); // DEBUG LOG
    }
}
