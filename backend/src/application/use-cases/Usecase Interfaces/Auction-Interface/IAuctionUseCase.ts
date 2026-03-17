import { AuctionResponseDTO } from "../../../dtos/AuctionDTO"
import { CreateAuctionDTO } from "../../../dtos/AuctionDTO"

export interface ICreateAuctionUseCase{
    execute(autionData:CreateAuctionDTO):Promise<AuctionResponseDTO>
}