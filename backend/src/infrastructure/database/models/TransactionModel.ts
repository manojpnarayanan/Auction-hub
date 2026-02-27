import { Schema,model,Document,Types } from "mongoose";


export interface ITransactionDocument extends Document{
    _id:Types.ObjectId;
    walletId:Types.ObjectId;
    userId:Types.ObjectId;
    amount:number;
    type:'credit'|'debit';
    status:'pending'|'completed' | 'failed' | 'refunded';
    purpose:string;
    auctionId?:Types.ObjectId;
    stripePaymentIntentId?:string;
    description:string;
    createdAt:Date;
}

const TransactionSchema= new Schema<ITransactionDocument>({
    walletId:{type:Schema.Types.ObjectId, ref:"Wallet", required:true},
    userId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    amount:{type:Number, required:true},
    type:{type:String,enum:['credit','debit'],required:true},
    status:{type:String,enum:['pending','completed','failed','refunded'],default:'pending'},
    purpose:{type:String,required:true},
    auctionId:{type:Schema.Types.ObjectId,ref:"Auction"},
    stripePaymentIntentId:{type:String},
    description:{type:String,default:""}
},{timestamps:true});

export const TransactionModel=model<ITransactionDocument>("Transaction",TransactionSchema);