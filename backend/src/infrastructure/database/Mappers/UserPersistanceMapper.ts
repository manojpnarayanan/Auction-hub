import { User } from "../../../domain/entities/User.entity";
import { IUserDocument } from "../models/UserModel";


export class UserPersistanceMapper{
    static toEntity(doc:IUserDocument):User{
        return new User(
            (doc._id as any).toString(),
        doc.name,
        doc.email,
        doc.password ||"",
        doc.role,
        doc.createdAt,
        doc.updatedAt,
        doc.otp,
        doc.otpExpiry,
        doc.googleId,
        doc.isVerified,
        doc.isBlocked
        )
    }
}