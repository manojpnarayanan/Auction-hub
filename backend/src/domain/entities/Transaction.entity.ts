export type TransactionType='credit'  | 'debit';
export type TransactionStatus= 'pending' | 'completed' | 'failed' | 'refunded';

export type TransactionPurpose=
| 'auction_payment'
| 'subscription_payment'
| 'seller_credit'
| 'commission'
| 'refund';

export class Transactions {
    constructor(
        public readonly id:string,
        public readonly userId:string,
        public readonly walletId:string,
        public readonly amount:number,
        public readonly type:TransactionType,
        public readonly status:TransactionStatus,
        public readonly purpose:TransactionPurpose,
        public readonly auctionId?:string,
        public readonly stripePaymentIntentId?:string,
        public readonly description:string="",
        public readonly isReleased?:boolean,
        public readonly createdAt:Date=new Date(),
    ){}
}
