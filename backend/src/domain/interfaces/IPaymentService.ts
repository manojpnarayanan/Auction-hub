export interface PaymentIntentResult{
    id:string;
    clientSecret:string;
    amount:number;
    currency:string;
    status:string;
}
export interface IPaymentService{
    createPaymentIntent(amount:number,currency:string,metadata:Record<string,string>):Promise<PaymentIntentResult>;
    retrievePaymentIntent(paymentIntentId:string):Promise<PaymentIntentResult>;
    constructWebhookEvent(payload:Buffer,signature:string,secret:string):unknown;
    createCheckoutSession(amount:number,currency:string,planName:string,metadata:Record<string,string>,successUrl:string,cancelUrl:string):Promise<string>
}