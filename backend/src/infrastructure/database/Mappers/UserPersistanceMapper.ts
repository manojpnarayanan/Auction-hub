import { User } from "../../../domain/entities/User.entity";
import { IUserDocument } from "../models/UserModel";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { CloudinaryService } from "../../Service/CloudinaryService";




export class UserPersistanceMapper{
    constructor(
        @inject(TYPES.CloudinaryService)private _cloudService:CloudinaryService
    ){}
     toEntity(doc:IUserDocument):User{
        const signedProfileImage=doc.profileImage ? this._cloudService.generateSignedUrl(doc.profileImage,15) : undefined;
        return new User(
            (doc._id as unknown as string).toString(),
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
        doc.isBlocked,
        doc.phone,
        signedProfileImage,
        doc.watchlist || []
        )
    }
}