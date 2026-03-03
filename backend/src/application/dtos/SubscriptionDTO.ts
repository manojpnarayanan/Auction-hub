export type PlanType=string;


export interface SubscribePlanDTO{
    userId:string;
    planId:string;
    plan:PlanType;
}

export interface SubscriptionResponseDTO{
    id:string;
    userId:string;
    planId:string;
    plan:PlanType;
    startDate:Date;
    endDate:Date;
    status:'active' | 'expired'
}

export interface GetSubscriptionResponseDTO{
    plan:PlanType;
    subscription:SubscriptionResponseDTO | null;
    limits:{
        auctionsPerYear:number;
        maxDays:number;
        hasLive:boolean;
        commission:number
    }
}

export interface SubscriptionPaymentIntentDTO{
    clientSecret:string;
    paymentIntentId:string;
    amount:number;
}

export interface ConfirmSubscriptionDTO{
    userId:string;
    planId:string;
    plan:PlanType;
    startDate:Date;
    endDate:Date;
    status:string;
    id:string;
}