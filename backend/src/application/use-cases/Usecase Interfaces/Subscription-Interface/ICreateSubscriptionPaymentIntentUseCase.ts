import { SubscriptionPaymentIntentDTO } from "../../../dtos/SubscriptionDTO"

export interface ICreateSubscriptionPaymentIntentUseCase{
    execute(userId:string,planId:string,planName:string):Promise<SubscriptionPaymentIntentDTO>
}