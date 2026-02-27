import { Transactions } from "../../../domain/entities/Transaction.entity";
import { ITransactionDocument } from "../models/TransactionModel";



export class TransactionPersistanceMapper{
    static toEntity(doc:ITransactionDocument):Transactions{
        return new Transactions(
            doc._id.toString(),
            doc.walletId.toString(),
            doc.userId.toString(),
            doc.amount,
            doc.type,
            doc.status,
            doc.purpose as any,
            doc.auctionId?.toString(),
            doc.stripePaymentIntentId,
            doc.description,
            doc.createdAt
        )
    }
}