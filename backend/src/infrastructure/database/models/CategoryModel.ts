import mongoose, {Schema, Document} from "mongoose";


export interface ICategoryDocument extends Document{
    name:string;
    description:string;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const CategorySchema=new Schema<ICategoryDocument>({
    name:{type:String,required:true,unique:true,trim:true},
    description:{type:String},
    isActive:{type:Boolean,default:true}
},{timestamps:true});

export const CategoryModel=mongoose.model<ICategoryDocument>("Category",CategorySchema);