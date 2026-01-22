import { Auction } from "../../../../domain/entities/Auction.entity"
import { AuctionResponseDTO } from "../../../dtos/AuctionDTO"
export interface ICreateAuctionUseCase{
    execute(autionData:any):Promise<AuctionResponseDTO>
}