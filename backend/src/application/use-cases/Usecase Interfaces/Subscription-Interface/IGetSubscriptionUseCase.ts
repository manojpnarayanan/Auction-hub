import { GetSubscriptionResponseDTO } from "../../../dtos/SubscriptionDTO";


export interface IGetSubscriptionUseCase{
    execute(userId:string):Promise<GetSubscriptionResponseDTO>;
}