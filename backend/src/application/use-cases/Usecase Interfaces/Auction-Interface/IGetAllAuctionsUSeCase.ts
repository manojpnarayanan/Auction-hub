import { Auction } from "../../../../domain/entities/Auction.entity";


export interface IGetAllAuctionUseCase{
    execute():Promise<Auction[]>
}