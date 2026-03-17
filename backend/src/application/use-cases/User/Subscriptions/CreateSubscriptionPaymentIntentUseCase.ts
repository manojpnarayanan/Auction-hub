import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ICreateSubscriptionPaymentIntentUseCase } from "../../Usecase Interfaces/Subscription-Interface/ICreateSubscriptionPaymentIntentUseCase";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { SubscriptionPaymentIntentDTO } from "../../../dtos/SubscriptionDTO";
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";


@injectable()
export class createSubscriptionPaymentIntentUseCase implements ICreateSubscriptionPaymentIntentUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository,
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository,
        @inject(TYPES.PaymentService)private _paymentService:IPaymentService
    ){}
    async execute(userId: string, planId: string, planName: string): Promise<SubscriptionPaymentIntentDTO> {
        const plan=await this._subscriptionPlanRepo.findById(planId);
        if(!plan) throw new Error("Plan not found");
        let priceToPay=plan.price;
        const activeSub=await this._subscriptionRepository.findActiveByUSerId(userId);
        if(activeSub){
            const currentPlan=await this._subscriptionPlanRepo.findById(activeSub.planId);
            if(currentPlan){
                if(!plan.isUpgrade(currentPlan)){
                    throw new Error("You can only upgrade to higher plans");
                }
                priceToPay=plan.price  -  currentPlan.price
            }
        }
        
        const amountInPaise=priceToPay*100;
        const metadata={
            type:'subscription',
            userId:userId,
            planId:planId,
            planName:planName
        }
        const paymentIntent=await this._paymentService.createPaymentIntent(amountInPaise,"inr",metadata);
        return {
            clientSecret:paymentIntent.clientSecret,
            paymentIntentId:paymentIntent.id,
            amount:amountInPaise
        }
    }
}