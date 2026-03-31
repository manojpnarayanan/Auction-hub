import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { INotificationRepository } from "../../../../domain/interfaces/INotificationRepository";
import { IMarkNotificationReadUseCase } from "../../Usecase Interfaces/Notification-Interface/IMarkNotificationReadUseCase";


@injectable()
export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase{
    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepo:INotificationRepository
    ){}

    async execute(id: string): Promise<void> {
        await this._notificationRepo.markAsRead(id);
    }
}