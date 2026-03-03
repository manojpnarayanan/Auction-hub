import { Subscription } from "../../domain/entities/Subscription.entity";
import { SubscriptionResponseDTO } from "../dtos/SubscriptionDTO";



export class SubscriptionDTOMapper{
    static toResponseDTO(doc:Subscription):SubscriptionResponseDTO{
        return {
            id:doc.id!,
            userId:doc.userId,
            planId:doc.planId,
            plan:doc.plan,
            startDate:doc.startDate,
            endDate:doc.endDate,
            status:doc.status
        }
    }
}