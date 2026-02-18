
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

    ){ }
}