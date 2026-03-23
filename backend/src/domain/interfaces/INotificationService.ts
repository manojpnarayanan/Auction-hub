import { Notification } from "../entities/Notification.entity";


export interface INotificationService{
    notify(userId:string,notification:Notification):Promise<void>;
    notifyAdmin(notification:Notification):Promise<void>;
}