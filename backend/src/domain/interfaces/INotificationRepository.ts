import { Notification } from "../entities/Notification.entity";


export interface INotificationRepository{
    create(notification:Notification):Promise<Notification>;
    findById(id:string):Promise<Notification | null>;
    findByUserId(userId:string):Promise<Notification[]>;
    markAsRead(id:string):Promise<void>;
    markAllAsRead(userId:string):Promise<void>;
}