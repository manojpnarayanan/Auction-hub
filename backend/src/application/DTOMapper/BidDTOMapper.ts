import { Auction } from "../../domain/entities/Auction.entity";
import { Bid } from "../../domain/entities/Bid.entity";
import { AuctionSummaryDTO, UserBidResponseDTO, BidStatusType, BidResponseDTO } from "../dtos/BidDTO";

export class BidDTOMapper{
    static toAuctionSummaryDTO(auction:Auction):AuctionSummaryDTO{
        return {
            id:auction.id!,
            title:auction.title,
            description:auction.description,
            category:auction.category,
            currentPrice:auction.currentPrice,
            startingPrice:auction.startingPrice,
            endDate:auction.endDate,
            status:auction.status,
            images:auction.images,
            type:auction.type
        }
    }

    static BidtoResponse(bid:Bid):BidResponseDTO{
        return {
            id:bid.id !,
            auctionId:bid.auctionId,
            bidderId:bid.bidderId,
            amount:bid.amount,
            time:bid.time
        }
    }
}