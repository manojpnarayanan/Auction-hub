export type PlanType= string;



export class Subscription{
    constructor(
        public readonly userId:string,
        public readonly planId:string,
        public readonly plan:PlanType,
        public readonly startDate:Date,
        public readonly endDate:Date,
        public readonly status:'active'| 'expired' ='active',
        public readonly id?:string
    ){}
}