import { CreateAuctionDTO } from "../../../dtos/AuctionDTO";

  

export interface IGetAllListedAuctionUseCase{
    execute(sellerId:string):Promise<CreateAuctionDTO []>
}