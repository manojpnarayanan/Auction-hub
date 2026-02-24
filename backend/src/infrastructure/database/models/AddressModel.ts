import {Schema,model,Document,Types } from "mongoose";


export interface IAddressDocument extends Document{
    _id:Types.ObjectId;
    userId:Types.ObjectId;
    label:"Home" |"Work" | "Other";
    street:string;
    city:string;
    state:string;
    pincode:string;
    isDefault:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const AddressSchema= new Schema<IAddressDocument>({
    userId:{type:Schema.Types.ObjectId, ref:"User", required :true},
    label:{type:String,enum:['Home','Work','Other'],default:"Home"},
    street:{type:String, required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pincode:{type:String,required:true},
    isDefault:{type:Boolean,default:false}
},{timestamps:true});

export const AddressModel=model<IAddressDocument>('Address',AddressSchema);