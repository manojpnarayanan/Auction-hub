import { IGetSubscriptionUseCase } from "../../Usecase Interfaces/Subscription-Interface/IGetSubscriptionUseCase";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { SubscriptionDTOMapper } from "../../../DTOMapper/SubscriptionDTOMapper";
import { GetSubscriptionResponseDTO} from "../../../dtos/SubscriptionDTO";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";

@injectable()
export class GetSubscriptionUseCase implements IGetSubscriptionUseCase{

    constructor(
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository,
        @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository:ISubscriptionPlanRepository
    ){}
    async execute(userId:string): Promise<GetSubscriptionResponseDTO> {
        const subscription=await this._subscriptionRepository.findActiveByUSerId(userId);
        let activePlanDetails;
        if(subscription){
            activePlanDetails=await this._subscriptionPlanRepository.findById(subscription.planId);
        }else{
            const allPlans=await this._subscriptionPlanRepository.findAll();
            activePlanDetails=allPlans.find(plan=>plan.isDefault && plan.isActive);
        }
        const finalPlan=activePlanDetails || {
            name:'guest',
            auctionsPerYear:0,
            maxDays:0,
            hasLive:false,
            commission:0.10     
        }

        
        
        // let limits={auctionsPerYear: 1, maxDays: 3, hasLive: false, commission: 0.06}
        // let planName='Guest';
        // const plan=subscription?.plan?? 'free'
        return {
            plan:finalPlan.name,
            subscription:subscription?
            SubscriptionDTOMapper.toResponseDTO(subscription):null,
            limits:{
                auctionsPerYear:finalPlan.auctionsPerYear,
                maxDays:finalPlan.maxDays,
                hasLive:finalPlan.hasLive,
                commission:finalPlan.commission
            }
        } 
    }
}