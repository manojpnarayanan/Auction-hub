

export class Dispute{
    constructor(
        public auctionId:string,
        public buyerId:string,
        public sellerId:string,
        public reason:string,
        public status:'open' | 'under_review' | 'resolved_refunded' | 'resolved_rejected'= 'open',
        public adminNote?:string,
        public id?:string,
        public createdAt?:Date,
    ){}
}