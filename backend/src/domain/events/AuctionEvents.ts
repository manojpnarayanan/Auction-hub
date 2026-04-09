import { IDomainEvent } from "./IDomainEvent";


export class BidPlacedEvent implements IDomainEvent{
    public dateTimeOccurred:Date;
    constructor(
        public readonly auctionId:string,
        public readonly bidderId:string,
        public readonly amount:number,
        public readonly bidderName:string,
        public readonly time:Date,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class AuctionStartedEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly startTime:Date,
        public readonly currentPrice:number,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class AuctionEndedEvent implements IDomainEvent{
    public dateTimeOccurred:Date;
    constructor(
        public readonly auctionId:string,  
        public readonly status:string,  
        public readonly winnerId:string | undefined,  
        public readonly finalPrice:number,
        public readonly auctionTitle:string, 
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId;
    }
}

export class AuctionCancelledEvent implements IDomainEvent{
    public dateTimeOccurred:Date;
    constructor(
        public readonly auctionId:string,
        public readonly message:string,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}
export class AuctionRejectedEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly sellerId:string,
        public readonly reason:string,
        public readonly auctionTitle:string,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class AuctionCancellationRequestEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly sellerId:string,
        public readonly reason:string,
    ){
        this.dateTimeOccurred=new Date()
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class AuctionApprovedEvent implements IDomainEvent{
    public dateTimeOccurred:Date;
    constructor(
        public readonly auctionId:string,
        public readonly sellerId:string,
        public readonly auctionTitle:string,
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId
    }
}

export class AuctionCreatedEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly sellerId:string,
        public readonly title:string
    ){
        this.dateTimeOccurred=new Date()
    }
    getAggregateId(): string {
        return this.auctionId
    }
}