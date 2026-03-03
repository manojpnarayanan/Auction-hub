import { UpdataSubscriptionPlanDTO,SubscriptionPlanResponseDTO } from "../../../dtos/SubscriptionPlanDTO";



export interface IUpdateSubscriptionPlanUseCase{
    execute(id:string,data:UpdataSubscriptionPlanDTO):Promise<SubscriptionPlanResponseDTO | null>
}