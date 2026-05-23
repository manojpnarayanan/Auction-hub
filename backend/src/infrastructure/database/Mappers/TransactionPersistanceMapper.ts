import { Transactions } from "../../../domain/entities/Transaction.entity";
import { ITransactionDocument } from "../models/TransactionModel";
import { TransactionPurpose } from "../../../domain/entities/Transaction.entity";

interface PopulatedUser{
    _id:{toString():string};
    name:string;
}

interface PopulatedAuction{
    _id:{toString():string};
    title:string;
}

function isPopulatedUser(obj:unknown):obj is PopulatedUser{
    return !!obj && typeof obj === 'object' && 'name' in obj;
}

function isPopulatedAuction(obj:unknown):obj is PopulatedAuction{
    return !!obj && typeof obj === 'object' && 'title' in obj
}

export class TransactionPersistanceMapper{
    static toEntity(doc:ITransactionDocument):Transactions{
        const user = doc.userId
        const userName= isPopulatedUser(user) ? user.name : undefined;
        const userIdStr=isPopulatedUser(user) ? user._id.toString() : user.toString();

        const auction = doc.auctionId
        const auctionTitle = isPopulatedAuction(auction)? auction.title : undefined;
        const auctionIdStr=auction ? (isPopulatedAuction(auction) ? auction._id.toString() : auction.toString() ) : undefined;
        return new Transactions(
            doc._id.toString(),
            userIdStr,
            doc.walletId.toString(),
            doc.amount,
            doc.type,
            doc.status,
            doc.purpose as TransactionPurpose,
            auctionIdStr,
            doc.stripePaymentIntentId,
            doc.description,
            doc.isReleased,
            doc.createdAt,
            userName,
            auctionTitle
        )
    }
}