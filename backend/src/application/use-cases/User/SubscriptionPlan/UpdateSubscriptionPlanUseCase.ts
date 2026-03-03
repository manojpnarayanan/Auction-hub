import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { IUpdateSubscriptionPlanUseCase } from "../../Usecase Interfaces/SubscriptionPlan-Interfaces/IUpdateSubscriptionPlanUseCase";
import { UpdataSubscriptionPlanDTO,SubscriptionPlanResponseDTO } from "../../../dtos/SubscriptionPlanDTO";
import { SubscriptionPlanDTOMapper } from "../../../DTOMapper/SubscriptionPlanDTOMapper";
import { ValidationError } from "../../../../domain/errors/errors";

@injectable()
export class UpdataSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(id: string, data: UpdataSubscriptionPlanDTO): Promise<SubscriptionPlanResponseDTO | null> {
        if(!data.name?.trim()){
            throw new ValidationError("Plan name required")
        }
        if(data.price !== undefined && data.price<0){
            throw new ValidationError("price cannot be negative")
        }
        if(data.auctionsPerYear !== undefined && data.auctionsPerYear<0){
            throw new Error("Must not be a negative number")
        }
        if (data.maxDays !== undefined && (data.maxDays < 1 || data.maxDays > 365)) {
        throw new ValidationError("Duration must be between 1 and 365 days");
        }

        if (data.maxDays !== undefined && (data.maxDays < 1 || data.maxDays > 365)) {
        throw new ValidationError("Duration must be between 1 and 365 days");
        }
        const existing=await this._subscriptionPlanRepo.findByName(data.name.trim());
        if(existing) throw new ValidationError("Plan with this name already exists");

        const updated=await this._subscriptionPlanRepo.update(id,data);
        return updated? SubscriptionPlanDTOMapper.toResponseDTO(updated) : null;
    }
}