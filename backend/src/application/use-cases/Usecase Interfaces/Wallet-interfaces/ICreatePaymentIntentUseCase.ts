import { createPaymentIntentDTO } from "../../../dtos/WalletDTO";


export interface PaymentIntentResponse{
    clientSecret:string;
    paymentIntentId:string;
};

export interface ICreatePaymentIntentUseCase{
    execute(buyerId:string,data:createPaymentIntentDTO):Promise<PaymentIntentResponse>;
};