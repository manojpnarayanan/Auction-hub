import { Auction } from "../../../domain/entities/Auction.entity";
import { IAuctionDocument } from "../models/AuctionModel";
import { CloudinaryService } from "../../Service/CloudinaryService";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";

@injectable()
export class AuctionPersistanceMapper{
    constructor(
        @inject(TYPES.CloudinaryService)private _cloudService:CloudinaryService
    ){}
     toEntity(doc:IAuctionDocument):Auction {
        const signedImages=doc.images.map(img=>this._cloudService.generateSignedUrl(img,15));
        return new Auction (
            doc.title,
            doc.description,
            doc.category,
            doc.startingPrice,
            doc.currentPrice,
            doc.endDate,
            doc.sellerId,
            signedImages,
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
            doc.paymentStatus || 'pending',
            doc.rejectionReason,
            doc.cancellationReason,
            doc.deliveryStatus || 'pending_delivery',
            doc.paidAt
        )
    }
}