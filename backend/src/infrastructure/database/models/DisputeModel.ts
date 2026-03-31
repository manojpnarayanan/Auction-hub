import {Schema,model,Types, Document } from "mongoose";



export interface IDisputeDocument extends Document{
    _id:Types.ObjectId;
    auctionId:Types.ObjectId |{ _id: Types.ObjectId; title: string };
    buyerId:Types.ObjectId | { _id: Types.ObjectId; name: string; email: string };
    sellerId:Types.ObjectId | { _id: Types.ObjectId; name: string; email: string };
    reason:string;
    status:'open'|'under_review' | 'resolved_refunded' | 'resolved_rejected';
    adminNote?:string;
    evidence?:string;
    createdAt:Date;
}

const DisputeSchema=new Schema<IDisputeDocument>({
    auctionId:{type:Schema.Types.ObjectId, ref:'Auction', required:true},
    buyerId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    sellerId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    reason:{type:String,required:true},
    status:{type:String,enum:['open', 'under_review','resolved_refunded', 'resolved_rejected'],default:'open'},
    adminNote:{type:String},
    evidence:{type:String},
},{timestamps:true});


export const DisputeModel=model<IDisputeDocument>('Dispute',DisputeSchema);