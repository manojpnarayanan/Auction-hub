import { SubscriptionPlan } from "../entities/SubscriptionPlan.entity"





export interface ISubscriptionPlanRepository{
    create(plan:SubscriptionPlan):Promise<SubscriptionPlan>;
    findAll():Promise<SubscriptionPlan[]>;
    findById(id:string):Promise<SubscriptionPlan | null>;
    update(id:string,data:Partial<SubscriptionPlan>):Promise<SubscriptionPlan | null>;
    delete(id:string):Promise<boolean>;
    findByName(name:string):Promise<SubscriptionPlan | null>;
}