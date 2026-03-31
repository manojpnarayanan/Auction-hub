import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import logger from "../../Global/Logger";
import { User } from "../../../domain/entities/User.entity";
import { CreateUserDTO, updateUserProfileDTO } from "../../../application/dtos/user.dto";
import { UserModel, IUserDocument } from "../models/UserModel";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { UserPersistanceMapper } from "../Mappers/UserPersistanceMapper";
import { NotFoundError } from "../../../domain/errors/errors";
import { FilterQuery } from "mongoose";
import { getDateConfig } from "../../../domain/utils/dateConfig";
import { TYPES } from "../../../di/types";


@injectable()
export class MongoUserRepository extends BaseRepository<User, IUserDocument> implements IUserRepository {
    constructor(
        @inject(TYPES.UserPersistanceMapper) private _userPersistanceMapper: UserPersistanceMapper
    ) {
        super(UserModel, _userPersistanceMapper.toEntity.bind(_userPersistanceMapper))
    }

    // async create(userData: CreateUserDTO): Promise<User> {
    //     const userDoc = await UserModel.create(userData);
    //     return UserPersistanceMapper.toEntity(userDoc);
    // }
    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email });
        return userDoc ? this._userPersistanceMapper.toEntity(userDoc) : null;
    }
    // async findById(id: string): Promise<User | null> {
    //     const userDoc = await UserModel.findById(id);
    //     return userDoc ? UserPersistanceMapper.toEntity(userDoc) : null
    // }

    async updateOTP(userId: string, otp: string, expiry: Date): Promise<void> {
        await UserModel.updateOne({ _id: userId }, { otp, otpExpiry: expiry })
    }
    async findByGoogleId(googleId: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ googleId });
        return userDoc ? this._userPersistanceMapper.toEntity(userDoc) : null;
    }
    async updateUnVerifiedUser(userId: string, userData: CreateUserDTO): Promise<User> {
        const userDoc = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!userDoc) throw new Error("User not found");
        return this._userPersistanceMapper.toEntity(userDoc);
    }
    async updateVerifyStatus(userId: string, isVerified: boolean): Promise<void> {
        await UserModel.updateOne({ _id: userId }, { isVerified })
    }
    async updatePassword(_userId: string, _password: string): Promise<void> {
        // const userdoc = await UserModel.findByIdAndUpdate(userId, { password });
    }
    async adminUserManage(page: number, limit: number, search: string): Promise<{ users: User[]; total: number }> {
        const query: FilterQuery<IUserDocument> = { role: "user" };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }
        const skip = (page - 1) * limit;
        const [userDoc, total] = await Promise.all([
            UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            UserModel.countDocuments(query)
        ]);
        // logger.info("DB fetch ",JSON.stringify(userDoc,null,2))
        return {
            users: userDoc.map(doc => this._userPersistanceMapper.toEntity(doc)), total
        }
    }
    async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
        logger.info({ userId, isBlocked }, "Blocking user");
        await UserModel.findByIdAndUpdate(userId, { isBlocked });
    }
    async updateProfile(userId: string, data: updateUserProfileDTO): Promise<User> {
        const doc = await UserModel.findByIdAndUpdate(userId, data, { new: true });
        if (!doc) throw new NotFoundError("User not found");
        return this._userPersistanceMapper.toEntity(doc)
    }

    async updateGoogleId(userId: string, googleId: string): Promise<void> {
        await UserModel.updateOne({ _id: userId }, { googleId });
    }
    async findAdmin(): Promise<User | null> {
        const adminDoc = await UserModel.findOne({ role: 'admin' });
        return adminDoc ? this._userPersistanceMapper.toEntity(adminDoc) : null;
    }

    async getUserGrowth(period: "daily" | "monthly" | "yearly", customRange?: { from: Date; to: Date }): Promise<{ timeline: { label: string; count: number; }[]; }> {
        let from: Date;
        let to: Date | undefined;
        let format: string;

        if (customRange) {
            from = customRange.from;
            to = customRange.to;
            format = '%Y-%m-%d';
        } else {
            const config = getDateConfig(period);
            from = config.from;
            format = config.format;
        }

        const matchStage: Record<string, unknown> = {
            role: 'user',
            createdAt: { $gte: from, ...(to ? { $lte: to } : {}) }
        };

        const result = await UserModel.aggregate([
            { $match: matchStage },
            { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        return {
            timeline: result.map(r => ({ label: r._id, count: r.count }))
        };
    }

    getTotalUserCount(): Promise<number> {
        return UserModel.countDocuments({ role: 'user' })
    }
}