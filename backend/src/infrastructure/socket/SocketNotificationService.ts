import { injectable,inject } from "inversify";
import { TYPES } from "../../di/types";
import { INotificationService } from "../../domain/interfaces/INotificationService";
import { Notification } from "../../domain/entities/Notification.entity";
import { ISocketService } from "../../domain/interfaces/ISocketService";


@injectable()
export class SocketNotificationService implements INotificationService{
    constructor(
        @inject(TYPES.SocketService) private _socketService:ISocketService
    ){}
    async notify(userId: string, notification: Notification): Promise<void> {
        this._socketService.emit("notification",notification,userId);
    }

    async notifyAdmin(notification: Notification): Promise<void> {
        this._socketService.emit('admin_notification',notification,'admin')
    }
}