import { Transactions } from "../../../domain/entities/Transaction.entity";
import { ITransactionDocument } from "../models/TransactionModel";
import { TransactionPurpose } from "../../../domain/entities/Transaction.entity";


export class TransactionPersistanceMapper{
    static toEntity(doc:ITransactionDocument):Transactions{
        return new Transactions(
            doc._id.toString(),
            doc.userId.toString(),
            doc.walletId.toString(),
            doc.amount,
            doc.type,
            doc.status,
            doc.purpose as TransactionPurpose,
            doc.auctionId?.toString(),
            doc.stripePaymentIntentId,
            doc.description,
            doc.isReleased,
            doc.createdAt
        )
    }
}