import { Auction } from "../../../../domain/entities/Auction.entity";
import { AuctionResponseDTO } from "../../../dtos/AuctionDTO";


export interface IGetAllAuctionUseCase{
    execute(category:string):Promise<AuctionResponseDTO[]>
}