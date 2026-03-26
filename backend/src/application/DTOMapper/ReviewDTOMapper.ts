import { Review } from "../../domain/entities/Review.entity";
import { ReviewResponseDTO } from "../dtos/ReviewDTO";



export class ReviewDTOMapper{
    static toDTO(doc:Review):ReviewResponseDTO{
        return {
            id:doc.id!,
            auctionId:doc.auctionId,
            buyerId:doc.buyerId,
            sellerId:doc.sellerId,
            rating:doc.rating,
            comment:doc.comment,
            createdAt:doc.createdAt!
        }
    }
}