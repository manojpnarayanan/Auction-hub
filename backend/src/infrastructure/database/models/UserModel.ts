import { Schema, model, Document } from "mongoose"


export interface IUserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    role: "user" | "admin";
    otp?: string;
    otpExpiry?: Date;
    googleId?: string;
    isVerified: boolean;
    isBlocked:boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    role: { type: String, default: "user" },
    otp: { type: String },
    otpExpiry: { type: Date },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    isBlocked:{type:Boolean, default:false}
}, { timestamps: true });

export const UserModel = model<IUserDocument>("User", UserSchema)