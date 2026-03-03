import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { IcreateSubscriptionCheckoutUseCase } from "../../Usecase Interfaces/Subscription-Interface/ICreateSubscriptionCheckoutUseCase";



@injectable()
export class createSubscriptionCheckoutUseCase implements IcreateSubscriptionCheckoutUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository:ISubscriptionPlanRepository,
        @inject(TYPES.PaymentService) private _paymentService:IPaymentService
    ){}
    async execute(userId: string, planId: string, planName: string): Promise<string> {
        const plan=await this._subscriptionPlanRepository.findById(planId);
        if(!plan) throw new Error("Plan not found");
        const amountInPaise=plan.price*100;
        const successUrl=`${process.env.FRONTEND_URL}/user-profile?success=true`;
        const cancelUrl=`${process.env.FRONTEND_URL}/subscription-plans?caceled=true`;
        const metadata={
            userId:userId,
            planId:planId,
            planName:planName
        };
        const sessionUrl=await this._paymentService.createCheckoutSession(amountInPaise,"inr",plan.name,metadata,successUrl,cancelUrl);
        return sessionUrl;
    }
}