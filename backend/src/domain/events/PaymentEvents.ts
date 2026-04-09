import { IDomainEvent } from "./IDomainEvent";


export class PaymentConfirmedEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly auctionTitle:string,
        public readonly buyerId:string,
        public readonly amount:number,
        public readonly paymentIntentId:string,

    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class PaymentReleaseEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly auctionTitle:string,
        public readonly sellerId:string,
        public readonly buyerId:string,
        public readonly amount:number,
        public readonly commission:number,
        public readonly isAutomatic:boolean
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId;
    }
}

export class SubscriptionActivateEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly userId:string,
        public readonly planName:string,
        public readonly amount:number,
        public readonly endDate:Date,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.userId;
    }
}