export interface CreateSubscriptionPlanDTO{
    name:string;
    price:number;
    auctionsPerYear:number;
    maxDays:number;
    hasLive:boolean;
    commission:number;
    isDefault?:boolean;
}
export interface SubscriptionPlanResponseDTO{
    id:string;
    name:string;
     price:number;
    auctionsPerYear:number;
    maxDays:number;
    hasLive:boolean;
    commission:number;
    isActive:boolean;
    isDefault:boolean;
}

export interface UpdataSubscriptionPlanDTO{
    name?:string;
    price?:number;
    auctionsPerYear?:number;
    maxDays?:number;
    hasLive?:boolean;
    commission?:number;
    isActive?:boolean;
}