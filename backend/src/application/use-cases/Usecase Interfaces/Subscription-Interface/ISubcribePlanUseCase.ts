import { SubscribePlanDTO,SubscriptionResponseDTO } from "../../../dtos/SubscriptionDTO";


export interface ISubscribePlanUseCase{
    execute(data:SubscribePlanDTO): Promise<SubscriptionResponseDTO>;
}