import { Dispute } from "../../domain/entities/Dispute.entity";
import { DisputeResponseDTO } from "../dtos/DisputeDTO";


export class DisputeDTOMapper {
    static toDTO(doc: Dispute): DisputeResponseDTO {
        return {
            id: doc.id!,
            auctionId: doc.auctionId,
            buyerId: doc.buyerId,
            sellerId: doc.sellerId,
            reason: doc.reason,
            status: doc.status,
            adminNote: doc.adminNote,
            evidence:doc.evidence,
            createdAt: doc.createdAt!
        }
    }
}