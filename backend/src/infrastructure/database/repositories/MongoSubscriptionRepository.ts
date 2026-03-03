import { injectable } from "inversify";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { Subscription } from "../../../domain/entities/Subscription.entity";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { AuctionModel } from "../models/AuctionModel";


@injectable()
export class MongoSubscriptionRepository implements ISubscriptionRepository{

    async create(subcription: Subscription): Promise<Subscription> {
        const doc=await SubscriptionModel.create({
            userId:subcription.userId,
            planId:subcription.planId,
            plan:subcription.plan,
            startDate:subcription.startDate,
            endDate:subcription.endDate,
            status:subcription.status
        });
        return new Subscription(doc.userId,doc.planId,doc.plan,doc.startDate,doc.endDate,doc.status,doc._id.toString())
    }

    async findActiveByUSerId(userId: string): Promise<Subscription | null> {
        const doc=await SubscriptionModel.findOne({userId,status:'active',endDate:{$gt:new Date() }});
        if(!doc) return null;
        return new Subscription(doc.userId,doc.planId,doc.plan,doc.startDate,doc.endDate,doc.status,doc._id.toString())
    }

    async countAuctionsThisYear(userId: string): Promise<number> {
        const startofYear=new Date(new Date().getFullYear(),0,1);
        return AuctionModel.countDocuments({
            sellerId:userId,
            createdAt:{$gte:startofYear},
            status:{$nin:['rejected']}
        });
    }
    async expireOldPlans(): Promise<void> {
        await SubscriptionModel.updateMany(
            {status:'active',endDate:{$lt:new Date()}},
            {$set:{status:'expired'}}
        )
    }
}