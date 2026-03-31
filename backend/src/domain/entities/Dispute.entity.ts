export interface AuctionPopulated {
    _id:string;
    title:string;
}
export interface UserPopulated{
    _id:string;
    name:string;
    email:string;
}


export class Dispute {
    constructor(
        public auctionId: string | AuctionPopulated,
        public buyerId: string | UserPopulated,
        public sellerId: string | UserPopulated,
        public reason: string,
        public status: 'open' | 'under_review' | 'resolved_refunded' | 'resolved_rejected' = 'open',
        public adminNote?: string,
        public evidence?:string,
        public id?: string,
        public createdAt?: Date,
    ) { }
}