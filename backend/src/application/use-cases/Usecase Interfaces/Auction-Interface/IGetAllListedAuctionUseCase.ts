import { AuctionResponseDTO } from "../../../dtos/AuctionDTO";



export interface IGetAllListedAuctionUseCase {
    execute(sellerId: string, page?: number, limit?: number): Promise<{ data: AuctionResponseDTO[], total: number,totalPages:number }>
}