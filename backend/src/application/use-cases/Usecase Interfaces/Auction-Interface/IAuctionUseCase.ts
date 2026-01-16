import { Auction } from "../../../../domain/entities/Auction.entity"

export interface ICreateAuctionUseCase{
    execute(autionData:any):Promise<Auction>
}