import { CreateNotificationDTO } from "../../../dtos/NotificationDTO";


export interface ICreateNotificationUseCase{
    execute(data:CreateNotificationDTO):Promise<void>;
}