import mongoose ,{Schema ,Document} from "mongoose";


export interface IBidDocument extends Document{
    auctionId:string,
    bidderId:string,
    amount:number,
    time:Date
}


const BidSchema:Schema=new Schema({
    auctionId:{type:String,required:true,ref:"Auction"},
    bidderId:{type:String,required:true},
    amount:{type:Number,required:true},
    time:{type:Date,default:Date.now}
},{timestamps:true});



export const BidModel=mongoose.model<IBidDocument>("Bid",BidSchema);