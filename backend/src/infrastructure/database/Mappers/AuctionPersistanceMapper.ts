import { Auction } from "../../../domain/entities/Auction.entity";



export class AuctionPersistanceMapper{
    static toEntity(doc:any):Auction {
        return new Auction (
            doc.title,
            doc.description,
            doc.category,
            doc.startingPrice,
            doc.currentPrice,
            doc.endDate,
            doc.sellerId,
            doc.images,
            doc.status,
            doc._id.toString(),
            doc.type,
            doc.startTime,
            doc.winnerId,
            doc.bids? doc.bids.map((b:any)=>({
                bidderId:b.bidderId,
                amount:b.amount,
                time:b.time
            })):[],
            doc.createdAt,
            doc.paymentStatus || 'pending'
        )
    }
}