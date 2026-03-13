import { Wallet } from "../../../domain/entities/Wallet.entity";
import { IWalletDocumet } from "../models/WalletModel";



export class WalletPersistanceMapper{
    static toEntity(doc: IWalletDocumet):Wallet{
        return new Wallet(
            doc._id.toString(),
            doc.userId.toString(),
            doc.balance,
            doc.currency,
            doc.createdAt,
            doc.updatedAt
        )
    }
}