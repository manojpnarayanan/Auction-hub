import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { IHandleWebhookUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IHandleWebhookUseCase";
import { config } from "../../../../infrastructure/config/environment";


@injectable()
export class HandleWebhookUseCase implements IHandleWebhookUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private walletRepository:IWalletRepository,
        @inject (TYPES.PaymentService) private paymentService:IPaymentService
    ){}
    async execute(payload: Buffer, signature: string): Promise<void> {
        const event=this.paymentService.constructWebhookEvent(payload,signature,config.stripeWebhook)as {
            type:string;data:{object:{id:string;amount:number;metadata:Record<string,string>}}
        };
        if(event.type === 'payment_intent.succeeded'){
            const intent=event.data.object;
            const adminId=process.env.ADMIN_WALLET_USER_ID!;
            await this.walletRepository.credit(adminId,intent.amount/100);
            await this.walletRepository.updateTransactions(intent.id,'completed');
        }
    }
}