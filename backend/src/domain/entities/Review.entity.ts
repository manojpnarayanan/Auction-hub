


export class Review{
    constructor(
        public auctionId:string,
        public buyerId:string,
        public sellerId:string,
        public rating:number,
        public comment:string,
        public id?:string,
        public createdAt?:Date
    ){
        if(rating<1 || rating>5){
            throw new Error("Rating must be between 1 and 5")
        }
    }
}