import Stripe from "stripe";
import { config } from "../config/environment";
import { injectable } from "inversify";
import { IPaymentService,PaymentIntentResult } from "../../domain/interfaces/IPaymentService";


@injectable()
export class StripeService implements IPaymentService{
    private stripe:Stripe;

    constructor(){
        this.stripe=new Stripe(config.stripeSecretKey,{apiVersion:'2026-01-28.clover'})
    }
    async createPaymentIntent(amount:number,currency:string,metadata:Record<string, string>):Promise<PaymentIntentResult>{
        const intent=await this.stripe.paymentIntents.create({
            amount,
            currency,
            metadata,
            automatic_payment_methods:{enabled:true},
        });
        
        return {
            id:intent.id,
            clientSecret:intent.client_secret!,
            amount:intent.amount,
            currency:intent.currency,
            status:intent.status,
        }
    }
    async retrievePaymentIntent(paymentIntentId:string):Promise<PaymentIntentResult>{
        const intent=await this.stripe.paymentIntents.retrieve(paymentIntentId);

        return {
            id:intent.id,
            clientSecret:intent.client_secret!,
            amount:intent.amount,
            currency:intent.currency,
            status:intent.status
        }
    }
    constructWebhookEvent(payload:Buffer,signature:string,secret:string):unknown{
        return this.stripe.webhooks.constructEvent(payload,signature,secret);
    }
}