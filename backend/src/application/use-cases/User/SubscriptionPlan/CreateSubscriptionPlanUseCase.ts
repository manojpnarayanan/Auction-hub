import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types'
import { SubscriptionPlan } from "../../../../domain/entities/SubscriptionPlan.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { ICreateSubscriptionPlanUseCase } from "../../Usecase Interfaces/SubscriptionPlan-Interfaces/ICreateSubscriptionPlanUseCase";
import { CreateSubscriptionPlanDTO,SubscriptionPlanResponseDTO } from "../../../dtos/SubscriptionPlanDTO";
import { SubscriptionPlanDTOMapper } from "../../../DTOMapper/SubscriptionPlanDTOMapper";
import { ValidationError } from "../../../../domain/errors/errors";



@injectable()
export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private _subcriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(data: CreateSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO> {
        if(!data.name?.trim()){
            throw new ValidationError("plan name is required")
        }
        if(data.price<1){
            throw new ValidationError("Price cannot be negative")
        }
        if(data.maxDays<1 || data.maxDays>365 ){
            throw new ValidationError("Duration must be between 1 and 365 days")
        }
        if(data.auctionsPerYear<0){
            throw new ValidationError("Could now use negative numbers");
        }
        if(data.commission<0 || data.commission>100){
            throw new ValidationError("Commission must be between 1 and 100 percent")
        }
        const existing=await this._subcriptionPlanRepo.findByName(data.name.trim());
        if(existing) throw new ValidationError("A plan with this name already exists");
        const plan=new SubscriptionPlan(
            data.name,data.price,data.auctionsPerYear,data.maxDays,data.hasLive,data.commission,true
        ,data.isDefault ?? false)
        const saved=await this._subcriptionPlanRepo.create(plan)
        return SubscriptionPlanDTOMapper.toResponseDTO(saved);
    }
}