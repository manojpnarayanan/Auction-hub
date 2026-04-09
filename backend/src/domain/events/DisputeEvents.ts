import { IDomainEvent } from "./IDomainEvent";

export class DisputeRaisedEvent implements IDomainEvent{
    public dateTimeOccurred: Date;
    constructor(
        public readonly auctionId:string,
        public readonly auctionTitle:string,
        public readonly buyerId:string,
        public readonly reason:string
    ){
        this.dateTimeOccurred=new Date();
    }
    getAggregateId(): string {
        return this.auctionId;
    }
}