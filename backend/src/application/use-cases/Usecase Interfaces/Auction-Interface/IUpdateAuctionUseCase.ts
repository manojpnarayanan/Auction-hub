import { Auction } from "../../../../domain/entities/Auction.entity";
import { UpdateAuctionDTO } from "../../../dtos/AuctionDTO";


export interface IUpdateAuctionUseCase{
    execute(auctionId:string, item:UpdateAuctionDTO):Promise<Auction | null >
}