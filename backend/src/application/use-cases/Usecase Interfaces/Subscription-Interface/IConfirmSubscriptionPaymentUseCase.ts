import { ConfirmSubscriptionDTO } from "../../../dtos/SubscriptionDTO"

export interface IConfirmSubscriptionPaymentUseCase{
    execute(userId:string,paymentIntentId:string,planId:string,planName:string):Promise<ConfirmSubscriptionDTO>
}