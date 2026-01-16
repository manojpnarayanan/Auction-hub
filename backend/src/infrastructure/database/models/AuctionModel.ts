import mongoose, {Schema,Document} from "mongoose"


export interface IAuctionDocument extends Document{
    title:string;
    description:string;
    category:string;
    startingPrice:number;
    currentPrice:number;
    endDate:Date;
    sellerId:string;
    images:string[];
    status:'active'| 'sold' | 'expired'
}

const AuctionSchema:Schema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    startingPrice:{type:Number,required:true},
    currentPrice:{type:Number, required:true},
    endDate:{type:Date ,required:true},
    sellerId:{type:String ,required:true},
    images:{type:[String], default:[]},
    status:{type:String,enum:['active','sold','expired'],default:'active'}
},{timestamps:true});

export const AuctionModel=mongoose.model<IAuctionDocument>("Auction",AuctionSchema);