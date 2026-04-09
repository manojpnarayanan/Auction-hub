import { Auction } from "../../domain/entities/Auction.entity";
import { AuctionResponseDTO } from "../dtos/AuctionDTO";



export class AuctionDTOMapper {
    static toResponseDTO(
        auction: Auction): AuctionResponseDTO {
        return {
            id: auction.id!,
            title: auction.title,
            description: auction.description,
            category: auction.category,
            startingPrice: auction.startingPrice,
            currentPrice: auction.currentPrice,
            endDate: auction.endDate,
            sellerId: auction.sellerId,
            images: auction.images,
            status: auction.status,
            type: auction.type,
            startTime: auction.startTime,
            winnerId: auction.winnerId,
            bids: auction.bids,
            paymentStatus: auction.paymentStatus,
            rejectionReason:auction.rejectionReason,
            cancellationReason:auction.cancellationReason,
            createdAt:auction.createdAt || new Date()
        }
    }
    static toResponseDTOs(auctions: Auction[]): AuctionResponseDTO[] {
        return auctions.map(auction => this.toResponseDTO(auction))
    }
}