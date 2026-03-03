import { injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { ISubscriptionPlanRepository } from "../../../domain/interfaces/ISubscriptionPlanRepository";
import { SubscriptionPlan } from "../../../domain/entities/SubscriptionPlan.entity";
import { SubscriptionPlanModel , ISubscriptionPlanDocument } from "../models/SubscriptionPlanModel";
import { SubscriptionPlanPersistanceMapper } from "../Mappers/SubscriptionPlanPersistanceMapper";


@injectable()

export class SubscriptionPlanRepository extends BaseRepository<SubscriptionPlan,ISubscriptionPlanDocument> implements ISubscriptionPlanRepository{
    constructor(){
        super(SubscriptionPlanModel,SubscriptionPlanPersistanceMapper.toEntity);
    }
    async findAll(): Promise<SubscriptionPlan[]> {
        const docs=await SubscriptionPlanModel.find({isActive:true});
        return docs.map(SubscriptionPlanPersistanceMapper.toEntity)
    }
    async findByName(name: string): Promise<SubscriptionPlan | null> {
        const doc=await SubscriptionPlanModel.findOne({name:{$regex:new RegExp(`^${name}$`,'i')}});
        return doc? SubscriptionPlanPersistanceMapper.toEntity(doc):null;
    }
     
}