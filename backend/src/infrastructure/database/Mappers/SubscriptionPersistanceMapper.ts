import { Subscription } from "../../../domain/entities/Subscription.entity";
import { ISubscriptionDocument } from "../models/SubscriptionModel";



export class SubscriptionPersistanceMapper{
    static toEntity(doc:ISubscriptionDocument):Subscription{
        return new Subscription(
            doc.userId,
            doc.planId,
            doc.plan,
            doc.startDate,
            doc.endDate,
            doc.status,
            doc.id,
        )
    }
}