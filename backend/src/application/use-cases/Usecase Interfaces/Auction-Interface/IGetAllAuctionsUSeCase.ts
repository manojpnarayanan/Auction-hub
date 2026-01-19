import { Auction } from "../../../../domain/entities/Auction.entity";


export interface IGetAllAuctionUseCase{
    execute(category:string):Promise<Auction[]>
}