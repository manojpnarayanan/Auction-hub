import { NotificationResponseDTO } from "../../../dtos/NotificationDTO";


export interface IGetNotificationUseCase{
    execute(userId:string):Promise<NotificationResponseDTO[]>;
}