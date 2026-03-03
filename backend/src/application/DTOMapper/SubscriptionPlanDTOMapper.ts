import { SubscriptionPlan } from "../../domain/entities/SubscriptionPlan.entity";
import { SubscriptionPlanResponseDTO } from "../dtos/SubscriptionPlanDTO";



export class SubscriptionPlanDTOMapper{
    static toResponseDTO(doc:SubscriptionPlan):SubscriptionPlanResponseDTO{
        return {
            id:doc.id!,
            name:doc.name,
            price:doc.price,
            auctionsPerYear:doc.auctionsPerYear,
            maxDays:doc.maxDays,
            hasLive:doc.hasLive,
            commission:doc.commission,
            isActive:doc.isActive,
            isDefault:doc.isDefault
        }
    }
}