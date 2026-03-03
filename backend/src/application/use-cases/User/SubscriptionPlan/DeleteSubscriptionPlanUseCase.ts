import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { IDeleteSubscriptionPlanUseCase } from "../../Usecase Interfaces/SubscriptionPlan-Interfaces/IDeleteSubscriptionPlanUseCase";
import { SubscriptionPlanDTOMapper } from "../../../DTOMapper/SubscriptionPlanDTOMapper";


@injectable()

export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase{
    constructor(
        @inject(TYPES.SubscriptionPlanRepository)private subscriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(id: string): Promise<boolean> {
        return await this.subscriptionPlanRepo.delete(id)
    }
}