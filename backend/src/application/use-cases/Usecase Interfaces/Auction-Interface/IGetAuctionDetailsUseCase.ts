import { Auction } from "../../../../domain/entities/Auction.entity"

export interface IGetAuctionDetailsUseCase{
    execute(id:string):Promise<Auction | null>
}