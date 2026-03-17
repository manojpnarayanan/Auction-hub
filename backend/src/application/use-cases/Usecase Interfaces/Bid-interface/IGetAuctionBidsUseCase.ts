import { AuctionBidResponseDTO } from "../../../dtos/BidDTO";

export interface IGetAuctionBidsUseCase{
    execute(auctionid:string):Promise<AuctionBidResponseDTO[]>
};