

export class Bid {
    constructor(
        public auctionId:string,
        public bidderId:string,
        public amount:number,
        public time:Date,
        public id?:string,
    ) {}
}