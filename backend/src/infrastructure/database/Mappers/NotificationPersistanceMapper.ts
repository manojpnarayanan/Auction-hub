import { Notification } from "../../../domain/entities/Notification.entity";
import { INotificationDocument } from "../models/NotificationModel";


export class NotificationPersistanceMapper {
    static toEntity(doc: INotificationDocument): Notification {
        return new Notification(
            doc.id,
            doc.userId.toString(),
            doc.title,
            doc.message,
            doc.type,
            doc.isRead,
            doc.createdAt,
            doc.link,
            doc.isAdmin
        )
    }
}