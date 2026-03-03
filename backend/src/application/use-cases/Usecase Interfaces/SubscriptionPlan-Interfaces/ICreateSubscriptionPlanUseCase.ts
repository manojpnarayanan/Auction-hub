import { SubscriptionPlanResponseDTO,CreateSubscriptionPlanDTO } from "../../../dtos/SubscriptionPlanDTO";



export interface ICreateSubscriptionPlanUseCase{
    execute(data:CreateSubscriptionPlanDTO):Promise<SubscriptionPlanResponseDTO>
}