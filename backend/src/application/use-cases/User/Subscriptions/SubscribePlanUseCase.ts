import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { ISubscribePlanUseCase } from "../../Usecase Interfaces/Subscription-Interface/ISubcribePlanUseCase";
import {  Subscription } from "../../../../domain/entities/Subscription.entity";
import { SubscribePlanDTO,SubscriptionResponseDTO } from "../../../dtos/SubscriptionDTO";
import { SubscriptionDTOMapper } from "../../../DTOMapper/SubscriptionDTOMapper";
import { ConflictError } from "../../../../domain/errors/errors";



@injectable()
export class SubscribePlanUseCase implements ISubscribePlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
    ){}
    async execute(data: SubscribePlanDTO): Promise<SubscriptionResponseDTO> {
        const startDate=new Date();
        const endDate=new Date();
        endDate.setFullYear(endDate.getFullYear()+1);// 1year subscription
        const existing=await this._subscriptionRepository.findActiveByUSerId(data.userId);
        if(existing){
            throw new ConflictError("User already has an active subcription");
        }
        
        const subscription= new Subscription(data.userId,data.planId,data.plan,startDate,endDate,'active');
        const saved= await this._subscriptionRepository.create(subscription);
        return SubscriptionDTOMapper.toResponseDTO(saved);

    }
}