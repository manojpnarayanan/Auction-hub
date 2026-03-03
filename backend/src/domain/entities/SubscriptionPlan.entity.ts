export class SubscriptionPlan{
    constructor(
        public name:string,
        public price:number,
        public auctionsPerYear:number,
        public maxDays:number,
        public hasLive:boolean,
        public commission:number,
        public isActive:boolean,
        public isDefault:boolean,
        public id?:string
    ){}
}