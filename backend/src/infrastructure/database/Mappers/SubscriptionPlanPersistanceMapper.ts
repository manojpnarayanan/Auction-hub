import { ISubscriptionPlanDocument } from "../models/SubscriptionPlanModel";
import { SubscriptionPlan } from "../../../domain/entities/SubscriptionPlan.entity";


export class SubscriptionPlanPersistanceMapper{
    static toEntity(doc:ISubscriptionPlanDocument):SubscriptionPlan{
        return new SubscriptionPlan(
            doc.name,
            doc.price,
            doc.auctionsPerYear,
            doc.maxDays,
            doc.hasLive,
            doc.commission,
            doc.isActive,
            doc.isDefault,
            doc._id.toString()
        )
    }
}