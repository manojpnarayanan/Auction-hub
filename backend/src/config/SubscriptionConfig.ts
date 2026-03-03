import { PlanType } from "../application/dtos/SubscriptionDTO"



export const PLAN_LIMITS:Record<PlanType,{
    auctionsPerYear:number;
    maxDays:number;
    hasLive:boolean;
    commission:number;
}>={
    free:{auctionsPerYear:1, maxDays:3,hasLive:false,commission:0.06},
    basic:{auctionsPerYear:5,maxDays:15,hasLive:true,commission:0.04},
    premium:{auctionsPerYear:Infinity,maxDays:30,hasLive:true,commission:0.02}
}