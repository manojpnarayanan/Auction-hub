
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
        public status:'active' | 'sold' |'expired'='active',
        public id?:string
    ){ }
}