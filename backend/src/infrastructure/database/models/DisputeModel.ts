import {Schema,model,Types, Document } from "mongoose";



export interface IDisputeDocument extends Document{
    _id:Types.ObjectId;
    auctionId:Types.ObjectId;
    buyerId:Types.ObjectId;
    sellerId:Types.ObjectId;
    reason:string;
    status:'open'|'under_review' | 'resolved_refunded' | 'resolved_rejected';
    adminNote?:string;
    createdAt:Date;
}

const DisputeSchema=new Schema<IDisputeDocument>({
    auctionId:{type:Schema.Types.ObjectId, ref:'Auction', required:true},
    buyerId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    sellerId:{type:Schema.Types.ObjectId, ref:'User', required:true},
    reason:{type:String,required:true},
    status:{type:String,enum:['open', 'under_review','resolved_refunded', 'resolved_rejected'],default:'open'},
    adminNote:{type:String}
},{timestamps:true});


export const DisputeModel=model<IDisputeDocument>('Dispute',DisputeSchema);