import { Bid } from "../../../domain/entities/Bid.entity";
import { IBidDocument } from "../models/BidModel";


export class BidpersistanceMapper{
    static toEntity(doc:IBidDocument):Bid{
        return new Bid(
            doc.auctionId,
            doc.bidderId,
            doc.amount,
            doc.time,
            doc.id
        )
    }
}