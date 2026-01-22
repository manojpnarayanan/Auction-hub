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
            status: auction.status
        }
    }
    static toResponseDTOs(auctions: Auction[]): AuctionResponseDTO[] {
        return auctions.map(auction => this.toResponseDTO(auction))
    }
}