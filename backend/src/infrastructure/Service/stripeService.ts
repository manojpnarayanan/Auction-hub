import Stripe from "stripe";
import { config } from "../config/environment";
import { injectable } from "inversify";
import { IPaymentService,PaymentIntentResult } from "../../domain/interfaces/IPaymentService";


@injectable()
export class StripeService implements IPaymentService{
    private _stripe:Stripe;

    constructor(){
        this._stripe=new Stripe(config.stripeSecretKey,{apiVersion:'2026-01-28.clover'})
    }
    async createPaymentIntent(amount:number,currency:string,metadata:Record<string, string>):Promise<PaymentIntentResult>{
        const intent=await this._stripe.paymentIntents.create({
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
        const intent=await this._stripe.paymentIntents.retrieve(paymentIntentId);

        return {
            id:intent.id,
            clientSecret:intent.client_secret!,
            amount:intent.amount,
            currency:intent.currency,
            status:intent.status
        }
    }
    constructWebhookEvent(payload:Buffer,signature:string,secret:string):unknown{
        return this._stripe.webhooks.constructEvent(payload,signature,secret);
    }
    async createCheckoutSession(amount: number, currency: string, planName: string, metadata: Record<string, string>, successUrl: string, cancelUrl: string): Promise<string> {
        const session=await this._stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:currency,
                        product_data:{
                            name:`Subcription:${planName}`,
                            description:`Auction hub ${planName} plan`
                        },
                        unit_amount:amount
                    },
                    quantity:1,
                },
            ],
            mode:"payment",
            success_url:successUrl,
            cancel_url:cancelUrl,
            metadata:metadata
        });
        if(!session.url) throw new Error("Failed to create Stripe checkout session");
        return session.url
    }
}