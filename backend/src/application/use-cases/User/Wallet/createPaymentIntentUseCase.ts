import { injectable,inject  } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { Wallet } from "../../../../domain/entities/Wallet.entity";
import { createPaymentIntentDTO } from "../../../dtos/WalletDTO";
import { ICreatePaymentIntentUseCase,PaymentIntentResponse } from "../../Usecase Interfaces/Wallet-interfaces/ICreatePaymentIntentUseCase";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";



@injectable()

export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository,
        @inject(TYPES.PaymentService) private _paymentService:IPaymentService,
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository
    ){}
    async execute(buyerId: string, data: createPaymentIntentDTO): Promise<PaymentIntentResponse> {
        let wallet=await this._walletRepository.findByUserId(buyerId);
        if(!wallet) {
            const newWallet=new Wallet("",buyerId,0,'inr',new Date(),new Date())
            wallet=await this._walletRepository.create(newWallet);
        }

        const auction = await this._auctionRepository.findById(data.auctionId);
        const title=auction?.title || data.auctionId;

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
            description:`Payment for auction ${title}`,
            
        });
        return {clientSecret:intent.clientSecret,paymentIntentId:intent.id}
    }
}