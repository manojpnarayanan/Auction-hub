export interface WalletResponseDTO{
    id:string;
    userId:string;
    balance:number;
    currency:string
}

export interface TransactionResponseDTO{
    id:string;
    amount:number;
    type:'credit'|'debit';
    status:string;
    purpose:string;
    description:string;
    auctionId?:string;
    createdAt:string;
    commissionPercent?:number;
}

export interface WalletWithTransactions{
    wallet:WalletResponseDTO;
    transactions:TransactionResponseDTO[];
}

export interface CreatePaymentIntentRequest{
    auctionId:string;
    amount:number;
}