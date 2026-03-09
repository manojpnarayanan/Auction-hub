import { WatchlistDTO } from "../dtos/WatchlistDTO";
import { Auction } from "../../domain/entities/Auction.entity";


export class WatchlistDTOMapper{
    static toDTO(auction:Auction):WatchlistDTO{
        return{
            id:auction.id!,
            title:auction.title,
            currentPrice:auction.currentPrice,
            endDate:auction.endDate,
            images:auction.images,
            status:auction.status,
            type:auction.type,
            sellerId:auction.sellerId,
        }
    }
}