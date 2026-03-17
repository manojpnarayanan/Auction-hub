import { UserBidResponseDTO } from "../../../dtos/BidDTO";


export interface IGetUserBidsUseCase {
   execute(userId: string, page?: number, limit?: number): Promise<{ data: UserBidResponseDTO[], total: number }>;
}