import {Schema,model,Types,Document} from 'mongoose';



export interface ISubscriptionDocument extends Document{
    _id:Types.ObjectId;
    userId:string;
    planId:string;
    plan:string;
    startDate:Date;
    endDate:Date;
    status:"active"|"expired";
}

const SubscriptionSchema:Schema=new Schema({
    userId:{type:String,required:true},
    planId:{type:String,required:true},
    plan:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    status:{type:String,enum:['active','expired'],default:'active'},

},{timestamps:true});


export const SubscriptionModel=model<ISubscriptionDocument>('Subscription',SubscriptionSchema)