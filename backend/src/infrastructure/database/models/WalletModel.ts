import { Schema,model,Document,Types } from "mongoose";


export interface IWalletDocumet extends Document{
    _id:Types.ObjectId;
    userId:Types.ObjectId;
    balance:number;
    currency:string;
    createdAt:Date;
    updatedAt:Date;
}

const WalletSchema= new Schema<IWalletDocumet>({
    userId:{type:Schema.Types.ObjectId, ref:'User',required:true,unique:true},
    balance:{type:Number, default:0,min:0},
    currency:{type:String,default:"inr"}
},{timestamps:true});

export const WalletModel=model<IWalletDocumet>("Wallet",WalletSchema)