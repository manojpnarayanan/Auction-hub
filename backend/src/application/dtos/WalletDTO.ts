export interface WalletResponseDTO{
    id:string;
    userId:string;
    balance:number;
    currency:string;
}
export interface TransactionResponseDTO{
    id:string;
    amount:number;
    type:'credit' |'debit';
    status:string;
    purpose:string;
    description:string;
    auctionId?:string;
    createdAt:string;
}
export interface createPaymentIntentDTO{
    auctionId:string;
    amount:number;
}

export interface confirmPaymentDTO{
    paymentIntentId:string;
    auctionId:string;
}

export interface releasePaymentDTO{
    transactionId:string;
    auctionId?:string;
    sellerId:string;
    amount:number;
    commissionPercent:number;
    sellerAmount:number;
}