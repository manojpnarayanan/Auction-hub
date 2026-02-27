
export class Auction{
    constructor(
        public title:string,
        public description:string,
        public category:string, //"Real Estate","Vehicles","Art"
        public startingPrice:number,
        public currentPrice:number,
        public endDate:Date,
        public sellerId:string,
        public images:string[],
        public status:'active' | 'sold' |'expired'| 'pending' | 'rejected'= 'pending',
        public id?:string,
        public type:"live" | "timed"="timed",
        public startTime?:Date,
        public winnerId?:string,
        public bids:{bidderId:string,amount:number,time:Date}[]=[],
        public createdAt?:Date,
        public paymentStatus:'pending'|'completed'='pending'

    ){ }

    isLive():boolean{
        const now=new Date();
        return  this.status==='active' && now< this.endDate && (!this.startTime || now>=this.startTime);
    }

    placeBid(bidderId:string,amount:number){
        if(!this.isLive) throw new Error("Auction is not Currently Live");
        if(bidderId === this.sellerId) throw new Error("Seller cannot bid on their own Auction");
        if(amount < this.currentPrice) throw new Error("Bid must be higher than curretn Price");
        this.bids.push({
            bidderId,
            amount,
            time:new Date()
        });
        this.currentPrice=amount;
        this.winnerId=bidderId;
    }
}