import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { ISubscribePlanUseCase } from "../../Usecase Interfaces/Subscription-Interface/ISubcribePlanUseCase";
import { IConfirmSubscriptionPaymentUseCase } from "../../Usecase Interfaces/Subscription-Interface/IConfirmSubscriptionPaymentUseCase";
import { ConfirmSubscriptionDTO } from "../../../dtos/SubscriptionDTO";
import { SubscribePlanDTO } from "../../../dtos/SubscriptionDTO";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";



@injectable()
export class confirmSubscriptionPaymentUseCase implements IConfirmSubscriptionPaymentUseCase{
    constructor(
        @inject(TYPES.PaymentService) private _privateService:IPaymentService,
        @inject(TYPES.SubscribePlanUseCase)private _subscribePlanUseCase:ISubscribePlanUseCase,
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository
    ){}
    async execute(userId: string, paymentIntentId: string, planId: string, planName: string): Promise<ConfirmSubscriptionDTO> {
        const intent=await this._privateService.retrievePaymentIntent(paymentIntentId);
        if(intent.status !=='succeeded'){
            throw new Error(`Payment Verification failed.Status:${intent.status}`);
        }
        const dto:SubscribePlanDTO={
            userId:userId,
            planId:planId,
            plan:planName.toLowerCase() as any
        }
        const activatedSubcription=await this._subscribePlanUseCase.execute(dto);
        const amount=intent.amount/100;
        const userWallet=await this._walletRepository.findByUserId(userId);
        if(userWallet){
            await this._walletRepository.createTransactions({
                walletId:userWallet.id,
                userId,
                amount,
                type:"debit",
                status:'completed',
                purpose:'subscription_payment',
                stripePaymentIntentId:paymentIntentId,
                description:`Subscription payment for ${planName}`
            })
        }
        const adminId=process.env.ADMIN_WALLET_USER_ID;
        if(!adminId) throw new Error("Admin wallet not found");
        await this._walletRepository.credit(adminId,amount);
        const adminWallet=await this._walletRepository.findByUserId(adminId);
        if(adminWallet){
            await this._walletRepository.createTransactions({
                walletId:adminWallet.id,
                userId:adminId,
                amount,
                type:'credit',
                status:'completed',
                purpose:'subscription_payment',
                stripePaymentIntentId:paymentIntentId,
                description:`Subscription revenue from user for ${planName} plan`
            })
        }
        return{
            id:activatedSubcription.id!,
            userId:activatedSubcription.userId,
            planId:activatedSubcription.planId,
            plan:activatedSubcription.plan,
            startDate:activatedSubcription.startDate,
            endDate:activatedSubcription.endDate,
            status:activatedSubcription.status
        }
    }
}