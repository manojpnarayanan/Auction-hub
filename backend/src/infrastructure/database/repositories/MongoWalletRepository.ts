import { injectable } from "inversify";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet.entity";
import { WalletModel } from "../models/WalletModel";
import { WalletPersistanceMapper } from "../Mappers/WalletPersistanceMapper";
import { Transactions } from "../../../domain/entities/Transaction.entity";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionPersistanceMapper } from "../Mappers/TransactionPersistanceMapper";





@injectable()
export class MongoWalletRepository implements IWalletRepository{
    
    async findByUserId(userId: string): Promise<Wallet | null> {
        const doc=await WalletModel.findOne({userId});
        return doc? WalletPersistanceMapper.toEntity(doc) : null;
    }
    async create(userId: string): Promise<Wallet> {
        const doc=await WalletModel.create({userId:userId,
            balance:0
        });
        return  WalletPersistanceMapper.toEntity(doc);
    }

    async credit(userId: string, amount: number): Promise<Wallet> {
        const doc=await WalletModel.findOneAndUpdate({userId},{$inc:{balance:amount}},{new :true,upsert:true});
        return WalletPersistanceMapper.toEntity(doc);
    }

    async debit(userId: string, amount: number): Promise<Wallet> {
        const wallet=await WalletModel.findOne({userId});
        const doc=await WalletModel.findOneAndUpdate({userId},{$inc:{balance:-amount}},{new:true});
        return WalletPersistanceMapper.toEntity(doc!);
    }

    async getTransactions(userId: string): Promise<Transactions[]> {
        const wallet=await WalletModel.findOne({userId});
        if(!wallet) return [];
        const doc=await TransactionModel.find({walletId:wallet._id}).sort({createdAt:-1});
        return doc.map(TransactionPersistanceMapper.toEntity)
    }

    async createTransactions(data: Partial<Transactions>): Promise<Transactions> {
        const doc=await TransactionModel.create(data);
        return TransactionPersistanceMapper.toEntity(doc);
    }

    async updateTransactions(stripePaymentIntentId: string, status: string): Promise<void> {
        await TransactionModel.findOneAndUpdate({stripePaymentIntentId},{status});
    }
}