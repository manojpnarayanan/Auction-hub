import { IDisputeDocument } from "../models/DisputeModel";
import { Dispute } from "../../../domain/entities/Dispute.entity";



export class DisputePersistanceMapper{
    static toEntity(doc:IDisputeDocument):Dispute{
        return new Dispute(
            doc.auctionId.toString(),
            doc.buyerId.toString(),
            doc.sellerId.toString(),
            doc.reason,
            doc.status,
            doc.adminNote,
            doc._id.toString(),
            doc.createdAt
        )
    }
}