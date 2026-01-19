import { User } from "../entities/User.entity";
import { CreateUserDTO } from "../../application/dtos/user.dto";


export interface IUserRepository {
    
    create(userData: CreateUserDTO): Promise<User>;

    
    findByEmail(email: string): Promise<User | null>;

    findById(id: string): Promise<User | null>;

    updateOTP(userId: string, otp: string|null, expiry: Date|null): Promise<void>;

    findByGoogleId(googleId: string): Promise<User | null>;
    updateUnVerifiedUser(userId:string,userData:CreateUserDTO):Promise<User>;
    updateVerifyStatus(userId:string,isVerified:boolean):Promise<void>;
    updatePassword(userId:string,password:string):Promise<void>;

    adminUserManage(page:number,limit:number,search:string):Promise<{users:User[],total:number}>;
    updateBlockStatus(userId:string,isBlocked:boolean):Promise<void>;
}
