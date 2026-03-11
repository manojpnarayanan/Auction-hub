import { UpdateAuctionDTO } from "../../../dtos/AuctionDTO";
import { AuctionResponseDTO } from "../../../dtos/AuctionDTO";


export interface IUpdateAuctionUseCase{
    execute(auctionId:string, item:UpdateAuctionDTO):Promise<AuctionResponseDTO | null >
}