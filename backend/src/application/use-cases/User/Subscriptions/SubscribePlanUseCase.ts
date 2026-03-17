import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { ISubscribePlanUseCase } from "../../Usecase Interfaces/Subscription-Interface/ISubcribePlanUseCase";
import {  Subscription } from "../../../../domain/entities/Subscription.entity";
import { SubscribePlanDTO,SubscriptionResponseDTO } from "../../../dtos/SubscriptionDTO";
import { SubscriptionDTOMapper } from "../../../DTOMapper/SubscriptionDTOMapper";
import { ConflictError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";



@injectable()
export class SubscribePlanUseCase implements ISubscribePlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository,
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(data: SubscribePlanDTO): Promise<SubscriptionResponseDTO> {
        const startDate=new Date();
        const endDate=new Date();
        endDate.setFullYear(endDate.getFullYear()+1);// 1year subscription
        const existing=await this._subscriptionRepository.findActiveByUSerId(data.userId);
        if(existing){
            const currentPlan=await this._subscriptionPlanRepo.findById(existing.planId);
            const newPlan=await this._subscriptionPlanRepo.findById(data.planId);
            if(currentPlan && newPlan){
                if(!newPlan.isUpgrade(currentPlan)){
                    throw new ConflictError("User already has an equal or higher active subcription");
                }
            }
            // throw new ConflictError("User already has an active subcription");
            await this._subscriptionRepository.update(existing.id!,{status:'expired'})
        }
        
        const subscription= new Subscription(data.userId,data.planId,data.plan,startDate,endDate,'active');
        const saved= await this._subscriptionRepository.create(subscription);
        return SubscriptionDTOMapper.toResponseDTO(saved);

    }
}