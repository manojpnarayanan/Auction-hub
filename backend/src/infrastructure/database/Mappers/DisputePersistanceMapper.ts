import { IDisputeDocument } from "../models/DisputeModel";
import { Dispute , AuctionPopulated, UserPopulated } from "../../../domain/entities/Dispute.entity";



export class DisputePersistanceMapper {
    static toEntity(doc: IDisputeDocument): Dispute {
        return new Dispute(
            doc.auctionId as unknown as (string | AuctionPopulated),
            doc.buyerId as unknown as (string | UserPopulated),
            doc.sellerId as unknown as (string | UserPopulated),
            doc.reason,
            doc.status,
            doc.adminNote,
            doc.evidence,
            doc._id.toString(),
            doc.createdAt
        )
    }
}