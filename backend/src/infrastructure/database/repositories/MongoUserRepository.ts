import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/User.entity";
import { CreateUserDTO } from "../../../application/dtos/user.dto";
import { UserModel , IUserDocument } from "../models/UserModel";
import {injectable} from "inversify"

@injectable()
export class MongoUserRepository implements IUserRepository{
    async create(userData: CreateUserDTO): Promise<User> {
        const userDoc=await UserModel.create(userData);
        return this.mapToEntity(userDoc);
    }
    async findByEmail(email: string): Promise<User | null> {
        const userDoc=await UserModel.findOne({email});
        return userDoc? this.mapToEntity(userDoc) :null;
    }
    async findById(id:string):Promise<User | null>{
        const userDoc=await UserModel.findById(id);
        return userDoc ? this.mapToEntity(userDoc) : null
    }

    async updateOTP(userId: string, otp: string, expiry: Date): Promise<void> {
        await UserModel.updateOne({_id:userId}, {otp, otpExpiry:expiry})
    }
    async findByGoogleId(googleId: string): Promise<User | null> {
        const userDoc=await UserModel.findOne({googleId});
        return userDoc ? this.mapToEntity(userDoc):null;
    }
    async updateUnVerifiedUser(userId:string,userData:CreateUserDTO):Promise<User>{
        const userDoc=await UserModel.findByIdAndUpdate(userId,userData,{new:true});
        if(!userDoc) throw new Error("User not found");
        return this.mapToEntity(userDoc);
    }
    async updateVerifyStatus(userId: string, isVerified: boolean): Promise<void> {
        await UserModel.updateOne({_id:userId},{isVerified})
    }
    async updatePassword(userId: string, password: string): Promise<void> {
        const userdoc=await UserModel.findByIdAndUpdate(userId,{password});
    }
    private mapToEntity(doc:IUserDocument):User{
        return new User(
            (doc._id as any).toString(),
            doc.name,
            doc.email,
            doc.password || "",
            doc.role,
            doc.createdAt,
            doc.updatedAt,
            doc.otp,
            doc.otpExpiry,
            doc.googleId,
            doc.isVerified
        )
    }
}