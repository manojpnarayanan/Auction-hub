import { ValidationError } from "../errors/errors";

export class Auction{
    constructor(
        public title:string,
        public description:string,
        public category:string,
        public startingPrice:number,
        public currentPrice:number,
        public endDate:Date,
        public sellerId:string,
        public images:string[],
        public status:'active' | 'sold' |'expired'| 'pending' | 'rejected' | 'cancelled' | 'pending_cancellation'= 'pending',
        public id?:string,
        public type:"live" | "timed"="timed",
        public startTime?:Date,
        public winnerId?:string,
        public bids:{bidderId:string,amount:number,time:Date}[]=[],
        public createdAt?:Date,
        public paymentStatus:'pending'|'completed'='pending',
        public rejectionReason?:string,
        public cancellationReason?:string,
        public deliveryStatus:'pending_delivery' | 'delivered' | 'disputed' = 'pending_delivery',
        public paidAt?:Date
    ){ }

    isLive():boolean{
        const now=new Date();
        return  this.status==='active' && now< this.endDate && (!this.startTime || now>=this.startTime);
    }

    placeBid(bidderId:string,amount:number){
        if(!this.isLive()) throw new ValidationError("Auction is not Currently Live");
        if(bidderId === this.sellerId) throw new ValidationError("Seller cannot bid on their own Auction");
        const minBid=this.currentPrice+1
        if(amount <minBid) throw new ValidationError("Bid must be higher than current Price");
        this.bids.push({
            bidderId,
            amount,
            time:new Date()
        });
        this.currentPrice=amount;
        this.winnerId=bidderId;
    }
}