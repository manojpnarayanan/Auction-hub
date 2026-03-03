import mongoose, {Schema,model,Document,Types} from 'mongoose';



export interface ISubscriptionPlanDocument extends Document{
    _id:Types.ObjectId;
    name:string;
    price:number;
    auctionsPerYear:number;
    maxDays:number;
    hasLive:boolean;
    commission:number;
    isActive:boolean;
    isDefault:boolean;
}

const SubscriptionPlanSchema=new Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    auctionsPerYear:{type:Number,required:true},
    maxDays:{type:Number,required:true},
    hasLive:{type:Boolean,required:true},
    commission:{type:Number,required:true},
    isActive:{type:Boolean,required:true},
    isDefault:{type:Boolean,default:false},
},{timestamps:true});

export const SubscriptionPlanModel=model<ISubscriptionPlanDocument>('SubscriptionPlan',SubscriptionPlanSchema)