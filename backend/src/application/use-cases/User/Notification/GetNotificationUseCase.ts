import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { INotificationRepository } from "../../../../domain/interfaces/INotificationRepository";
import { NotificationResponseDTO } from "../../../dtos/NotificationDTO";
import { NotificationDTOMapper } from "../../../DTOMapper/NotificationDTOMapper";
import { IGetNotificationUseCase } from "../../Usecase Interfaces/Notification-Interface/IGetNotificationUseCase";


@injectable()
export class GetNotificationUseCase implements IGetNotificationUseCase{
    constructor(
        @inject(TYPES.NotificationRepository)private _notificationRepo:INotificationRepository
    ){}
    async execute(userId: string): Promise<NotificationResponseDTO[]> {
        const notifications=await this._notificationRepo.findByUserId(userId);
        return NotificationDTOMapper.toResponseDTOs(notifications);
    }
}