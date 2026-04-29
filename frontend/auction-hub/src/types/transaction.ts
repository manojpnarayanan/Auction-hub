


export interface TransactionItem{
    id:string;
    amount:number;
    type:string;
    status:string;
    createdAt:string;
    description:string;
    purpose:string;
    auctionId?:string;
    auctionTitle?:string;
    userName?:string;
    sellerId?:string;
    isReleased?:string;
    commissionPercent?:number;
}