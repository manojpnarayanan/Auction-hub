import { Notification } from "../../domain/entities/Notification.entity";
import { NotificationResponseDTO } from "../dtos/NotificationDTO";


export class NotificationDTOMapper{
    static toResponseDTO(doc:Notification):NotificationResponseDTO{
        return {
            id:doc.id!,
            title:doc.title,
            message:doc.message,
            type:doc.type,
            isRead:doc.isRead,
            createdAt:doc.createdAt,
            link:doc.link
        }
    }


    static toResponseDTOs(docs:Notification[]):NotificationResponseDTO[]{
        return docs.map(n=>this.toResponseDTO(n))
    }
}