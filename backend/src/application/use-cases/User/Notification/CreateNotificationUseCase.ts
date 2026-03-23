import { injectable, inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ICreateNotificationUseCase } from "../../Usecase Interfaces/Notification-Interface/ICreateNotificationUseCase";
import { CreateNotificationDTO } from "../../../dtos/NotificationDTO";
import { INotificationRepository } from "../../../../domain/interfaces/INotificationRepository";
import { INotificationService } from "../../../../domain/interfaces/INotificationService";
import { Notification } from "../../../../domain/entities/Notification.entity";



@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository: INotificationRepository,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    ) { }
    async execute(data: CreateNotificationDTO): Promise<void> {
        const notification = new Notification(
            "",
            data.userId,
            data.title,
            data.message,
            data.type,
            false,
            new Date(),
            data.link,
        )

        const saved = await this._notificationRepository.create(notification);
        if (data.isAdmin) {
            await this._notificationService.notifyAdmin(saved);
        } else {
            await this._notificationService.notify(data.userId, saved);
        }
    }
}