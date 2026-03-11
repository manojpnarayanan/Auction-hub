import { injectable } from "inversify";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet.entity";
import { WalletModel } from "../models/WalletModel";
import { WalletPersistanceMapper } from "../Mappers/WalletPersistanceMapper";
import { Transactions } from "../../../domain/entities/Transaction.entity";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionPersistanceMapper } from "../Mappers/TransactionPersistanceMapper";





@injectable()
export class MongoWalletRepository implements IWalletRepository {

    async findByUserId(userId: string): Promise<Wallet | null> {
        const doc = await WalletModel.findOne({ userId });
        return doc ? WalletPersistanceMapper.toEntity(doc) : null;
    }
    async create(userId: string): Promise<Wallet> {
        const doc = await WalletModel.create({
            userId: userId,
            balance: 0
        });
        return WalletPersistanceMapper.toEntity(doc);
    }

    async credit(userId: string, amount: number): Promise<Wallet> {
        const doc = await WalletModel.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, { new: true, upsert: true });
        return WalletPersistanceMapper.toEntity(doc);
    }

    async debit(userId: string, amount: number): Promise<Wallet> {
        const wallet = await WalletModel.findOne({ userId });
        const doc = await WalletModel.findOneAndUpdate({ userId }, { $inc: { balance: -amount } }, { new: true });
        return WalletPersistanceMapper.toEntity(doc!);
    }

    async getTransactions(userId: string, page: number = 1, limit: number = 10): Promise<{ transactions: Transactions[], total: number }> {
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) return { transactions: [], total: 0 };
        const query = { walletId: wallet._id };
        const [docs, total] = await Promise.all([
            TransactionModel.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            TransactionModel.countDocuments(query)
        ]);
        return {
            transactions: docs.map(TransactionPersistanceMapper.toEntity),
            total
        };
    }

    async createTransactions(data: Partial<Transactions>): Promise<Transactions> {
        const doc = await TransactionModel.create(data);
        return TransactionPersistanceMapper.toEntity(doc);
    }

    async updateTransactions(stripePaymentIntentId: string, status: string): Promise<void> {
        await TransactionModel.findOneAndUpdate({ stripePaymentIntentId }, { status });
    }

    async findTransactionByIntentId(stripePaymentIntentId: string): Promise<Transactions | null> {
        const doc = await TransactionModel.findOne({ stripePaymentIntentId });
        return doc ? TransactionPersistanceMapper.toEntity(doc) : null;
    }
    async getPendingRelease(adminId: string): Promise<Transactions[]> {
        const docs=await TransactionModel.find({
            userId:adminId,
            purpose:"auction_payment",
            isReleased:false,
            type:"credit"
        }).sort({createdAt:-1});
        return docs.map(TransactionPersistanceMapper.toEntity);
    }
    async markTransactionAsReleased(transactionId: string): Promise<void> {
        const result=await TransactionModel.findByIdAndUpdate(transactionId,{isReleased:true},{new:true});
        if(result){
            console.log("Success:Transaction marked as release");
        }else{
            console.log("Could not find transction");
        }
    
    }
}