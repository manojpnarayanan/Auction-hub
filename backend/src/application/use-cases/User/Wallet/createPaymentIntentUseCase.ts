import { injectable,inject  } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { createPaymentIntentDTO } from "../../../dtos/WalletDTO";
import { ICreatePaymentIntentUseCase,PaymentIntentResponse } from "../../Usecase Interfaces/Wallet-interfaces/ICreatePaymentIntentUseCase";



@injectable()

export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository,
        @inject(TYPES.PaymentService) private _paymentService:IPaymentService
    ){}
    async execute(buyerId: string, data: createPaymentIntentDTO): Promise<PaymentIntentResponse> {
        let wallet=await this._walletRepository.findByUserId(buyerId);
        if(!wallet) {
            wallet=await this._walletRepository.create(buyerId)
        }
        const intent=await this._paymentService.createPaymentIntent(data.amount,'inr',{auctionId:data.auctionId,buyerId});
        await this._walletRepository.createTransactions({
            walletId:wallet.id,
            userId:buyerId,
            amount:data.amount/100,
            type:"debit",
            status:"pending",
            purpose:"auction_payment",
            auctionId:data.auctionId,
            stripePaymentIntentId:intent.id,
            description:`Payment for auction ${data.auctionId}`,
            
        });
        return {clientSecret:intent.clientSecret,paymentIntentId:intent.id}
    }
}