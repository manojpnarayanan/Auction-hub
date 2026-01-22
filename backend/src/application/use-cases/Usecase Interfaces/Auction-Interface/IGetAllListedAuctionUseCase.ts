import { AuctionResponseDTO, CreateAuctionDTO } from "../../../dtos/AuctionDTO";

  

export interface IGetAllListedAuctionUseCase{
    execute(sellerId:string):Promise<AuctionResponseDTO []>
}