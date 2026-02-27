export type PlanType= 'free'|'basic'|'premium';


export const PLAN_LIMITS={
    free:{auctionsPerYear:1, maxDay:3,hasLive:false,commission:0.06},
    basic:{auctionsPerYear:5,maxDays:15,hasLive:true,commission:0.04},
    premium:{auctionsPerYear:Infinity,maxDays:30,hasLive:true,commission:0.02}
}

export class Subscription{
    constructor(
        public readonly userId:string,
        public readonly plan:PlanType,
        public readonly startDate:Date,
        public readonly endDate:Date,
        public readonly status:'active'| 'expired' ='active',
        public readonly id?:string
    ){}
}