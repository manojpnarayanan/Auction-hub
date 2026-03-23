import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { INotificationRepository } from "../../../../domain/interfaces/INotificationRepository";
import { NotificationResponseDTO } from "../../../dtos/NotificationDTO";
import { NotificationDTOMapper } from "../../../DTOMapper/NotificationDTOMapper";
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