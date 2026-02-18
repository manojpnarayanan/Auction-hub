 import { UserBidResponseDTO } from "../../../dtos/BidDTO";


 export interface IGetUserBidsUseCase{
    execute(userId:string):Promise<UserBidResponseDTO[]>;
 }