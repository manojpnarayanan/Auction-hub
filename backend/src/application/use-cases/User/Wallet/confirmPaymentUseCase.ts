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
        @inject(TYPES.WalletRepository) private walletRepository:IWalletRepository,
        @inject (TYPES.PaymentService) private paymentService:IPaymentService,
        @inject (TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ){}
    async execute(buyerId: string, data: confirmPaymentDTO): Promise<void> {
        const intent=await this.paymentService.retrievePaymentIntent(data.paymentIntentId);
        if(intent.status!=='succeeded'){
            throw new ValidationError("Payment not confirmed by stripe");
        }
        const adminId=process.env.ADMIN_WALLET_USER_ID!;
        console.log("Confirm paytment",adminId);
        await this.walletRepository.credit(adminId,intent.amount/100);
        const adminWallet=await this.walletRepository.findByUserId(adminId);
        if(adminWallet){
            await this.walletRepository.createTransactions({
                walletId:adminWallet.id,
                userId:adminId,
                amount:intent.amount/100,
                type:'credit',
                status:'completed',
                purpose:'auction_payment',
                auctionId:data.auctionId,
                stripePaymentIntentId:data.paymentIntentId,
                description:`Payment received for auction ${data.auctionId}`
            });
        }
        await this.walletRepository.updateTransactions(data.paymentIntentId,'completed');
        await this.auctionRepository.updatePaymentStatus(data.auctionId,'completed')
    }
}