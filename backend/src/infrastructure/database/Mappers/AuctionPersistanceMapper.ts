import { Auction } from "../../../domain/entities/Auction.entity";
import { IAuctionDocument } from "../models/AuctionModel";


export class AuctionPersistanceMapper{
    static toEntity(doc:IAuctionDocument):Auction {
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
            doc.id,
            doc.type,
            doc.startTime,
            doc.winnerId,
            doc.bids? doc.bids.map((b:{bidderId:string,amount:number,time:Date})=>({
                bidderId:b.bidderId,
                amount:b.amount,
                time:b.time
            })):[],
            doc.createdAt,
            doc.paymentStatus || 'pending'
        )
    }
}