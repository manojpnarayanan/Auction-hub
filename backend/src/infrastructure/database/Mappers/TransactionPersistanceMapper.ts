import { Transactions } from "../../../domain/entities/Transaction.entity";
import { ITransactionDocument } from "../models/TransactionModel";
import { TransactionPurpose } from "../../../domain/entities/Transaction.entity";


export class TransactionPersistanceMapper{
    static toEntity(doc:ITransactionDocument):Transactions{
        const user = doc.userId as unknown as { _id: any, name?: string };
        const auction = doc.auctionId as unknown as { _id: any, title?: string };
        const userName=user.name;
        const auctionTitle=auction? auction.title : undefined
        return new Transactions(
            doc._id.toString(),
            user && user._id ? user._id.toString() : doc.userId.toString(),
            doc.walletId.toString(),
            doc.amount,
            doc.type,
            doc.status,
            doc.purpose as TransactionPurpose,
            doc.auctionId?.toString(),
            doc.stripePaymentIntentId,
            doc.description,
            doc.isReleased,
            doc.createdAt,
            userName,
            auctionTitle
        )
    }
}