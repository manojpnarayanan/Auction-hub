import { Review } from "../../../domain/entities/Review.entity";
import { IReviewDocument } from "../models/ReviewModel";




export class ReviewPersistanceMapper{
   static toEntity(doc:IReviewDocument):Review{
    return  new Review(
        doc.auctionId.toString(),
        doc.buyerId.toString(),
        doc.sellerId.toString(),
        doc.rating,
        doc.comment,
        doc.id,
        doc.createdAt
    )
   }
}