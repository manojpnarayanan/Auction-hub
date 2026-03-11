import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IGetAllSubscriptionPlanUseCase } from "../../Usecase Interfaces/SubscriptionPlan-Interfaces/IGetAllSubscriptionPlanUseCase";
import { GetSubscriptionResponseDTO } from "../../../dtos/SubscriptionDTO";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { SubscriptionPlanDTOMapper } from "../../../DTOMapper/SubscriptionPlanDTOMapper";
import { SubscriptionPlanResponseDTO } from "../../../dtos/SubscriptionPlanDTO";

@injectable()
export class GetAllSubscriptionPlanUseCase implements IGetAllSubscriptionPlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(): Promise<SubscriptionPlanResponseDTO[]> {
        const plans=await this._subscriptionPlanRepo.findAll();
        return plans.map(SubscriptionPlanDTOMapper.toResponseDTO)
    }
}