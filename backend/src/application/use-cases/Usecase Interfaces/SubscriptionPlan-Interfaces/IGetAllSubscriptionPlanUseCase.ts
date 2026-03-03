import { SubscriptionPlanResponseDTO } from "../../../dtos/SubscriptionPlanDTO";



export interface IGetAllSubscriptionPlanUseCase{
    execute():Promise<SubscriptionPlanResponseDTO[]>
}