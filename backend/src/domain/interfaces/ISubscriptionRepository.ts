import {Subscription} from '../../domain/entities/Subscription.entity';



export interface ISubscriptionRepository{
    create(subcription:Subscription):Promise<Subscription>;
    findActiveByUSerId(userId:string):Promise<Subscription | null>;
    countAuctionsThisYear(userId:string):Promise<number>;
    expireOldPlans():Promise<void>;
}