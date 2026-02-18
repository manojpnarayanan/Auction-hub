import { Auction } from "../../../../domain/entities/Auction.entity"
import { AuctionResponseDTO } from "../../../dtos/AuctionDTO"

export interface IGetAuctionDetailsUseCase{
    execute(id:string):Promise<AuctionResponseDTO | null>
}