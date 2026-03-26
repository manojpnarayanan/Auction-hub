import {Schema,model,Types,Document} from 'mongoose'



export interface IReviewDocument extends Document{
    auctionId:Types.ObjectId;
    buyerId:Types.ObjectId;
    sellerId:Types.ObjectId;
    rating:number;
    comment:string;
    createdAt:Date;
}

const ReviewSchema=new Schema({
    auctionId:{type:Schema.Types.ObjectId,ref:"Auction",required:true,unique:true},
    buyerId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    sellerId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    rating:{type:Number,required:true,min:1,max:5},
    comment:{type:String,required:true}
},{timestamps:true});


export const ReviewModel=model<IReviewDocument>("Review",ReviewSchema);