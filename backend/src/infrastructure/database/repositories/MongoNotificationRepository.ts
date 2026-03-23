import { injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { Notification } from "../../../domain/entities/Notification.entity";
import { INotificationDocument } from "../models/NotificationModel";
import { INotificationRepository } from "../../../domain/interfaces/INotificationRepository";
import NotificationModel from "../models/NotificationModel";
import { NotificationPersistanceMapper } from "../Mappers/NotificationPersistanceMapper";


@injectable()

export class MongoNotificationRepository extends BaseRepository<Notification,INotificationDocument> implements INotificationRepository{
    constructor(){super(NotificationModel,NotificationPersistanceMapper.toEntity)}
    
    async findByUserId(userId: string): Promise<Notification[]> {
        const doc=await NotificationModel.find({userId}).sort({createdAt:-1});
        return doc.map(NotificationPersistanceMapper.toEntity);
    }

    async markAsRead(id: string): Promise<void> {
        await NotificationModel.findByIdAndUpdate(id,{isRead:true});
    }

    async markAllAsRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({userId,isRead:false},{isRead:true});
    }
}