import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ICreateSubscriptionPaymentIntentUseCase } from "../../Usecase Interfaces/Subscription-Interface/ICreateSubscriptionPaymentIntentUseCase";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { SubscriptionPaymentIntentDTO } from "../../../dtos/SubscriptionDTO";

@injectable()
export class createSubscriptionPaymentIntentUseCase implements ICreateSubscriptionPaymentIntentUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository,
        @inject(TYPES.PaymentService)private _paymentService:IPaymentService
    ){}
    async execute(userId: string, planId: string, planName: string): Promise<SubscriptionPaymentIntentDTO> {
        const plan=await this._subscriptionPlanRepo.findById(planId);
        if(!plan) throw new Error("Plan not found");
        const amountInPaise=plan.price*100;
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