import { injectable } from "inversify";
import logger from "../../Global/Logger";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { Wallet } from "../../../domain/entities/Wallet.entity";
import { IWalletDocumet, WalletModel } from "../models/WalletModel";
import { WalletPersistanceMapper } from "../Mappers/WalletPersistanceMapper";
import { Transactions } from "../../../domain/entities/Transaction.entity";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionPersistanceMapper } from "../Mappers/TransactionPersistanceMapper";
import { BaseRepository } from "./BaseRepository";
import { getDateConfig } from "../../../domain/utils/dateConfig";
import { ITransactionDocument } from "../models/TransactionModel";


@injectable()
export class MongoWalletRepository extends BaseRepository<Wallet, IWalletDocumet> implements IWalletRepository {

    constructor() { super(WalletModel, WalletPersistanceMapper.toEntity) }

    async findByUserId(userId: string): Promise<Wallet | null> {
        const doc = await WalletModel.findOne({ userId });
        return doc ? WalletPersistanceMapper.toEntity(doc) : null;
    }
    async create(wallet: Wallet): Promise<Wallet> {
        const doc = await WalletModel.create({
            userId: wallet.userId,
            balance: wallet.balance || 0
        });
        return WalletPersistanceMapper.toEntity(doc);
    }

    async credit(userId: string, amount: number): Promise<Wallet> {
        const doc = await WalletModel.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, { new: true, upsert: true });
        return WalletPersistanceMapper.toEntity(doc);
    }

    async debit(userId: string, amount: number): Promise<Wallet> {
        // const wallet = await WalletModel.findOne({ userId });
        const doc = await WalletModel.findOneAndUpdate({ userId }, { $inc: { balance: -amount } }, { new: true });
        return WalletPersistanceMapper.toEntity(doc!);
    }

    async getTransactions(userId: string, page: number = 1, limit: number = 10,purpose?:string): Promise<{ transactions: Transactions[], total: number }> {
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) return { transactions: [], total: 0 };
        const query:Record<string , unknown> = { walletId: wallet._id, status: 'completed' };
        if(purpose) query.purpose=purpose
        const [docs, total] = await Promise.all([
            TransactionModel.find(query)
            .populate('auctionId','title')
            .populate('userId','name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            TransactionModel.countDocuments(query)
        ]);
        console.log("BEBUD+G Tranasctions",docs[0])
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
        const adminWallet=await  WalletModel.findOne({userId:adminId});
        if(!adminWallet) return [];
        const docs = await TransactionModel.find({
            walletId: adminWallet._id,
            purpose: "auction_payment",
            isReleased: false,
            type: "credit"
        }).sort({ createdAt: -1 });
        return docs.map(TransactionPersistanceMapper.toEntity);
    }
    async markTransactionAsReleased(transactionId: string): Promise<void> {
        const result = await TransactionModel.findByIdAndUpdate(transactionId, { isReleased: true }, { new: true });
        if (result) {
            logger.info("Success:Transaction marked as release");
        } else {
            logger.info("Could not find transction");
        }

    }
    async getTotalRevenue(period: "daily" | "monthly" | "yearly", customRange?: { from: Date; to: Date }): Promise<{ total: number; timeline: { label: string; amount: number; }[]; }> {
        let from: Date;
        let to: Date | undefined;
        let format: string;

        if (customRange) {
            from = customRange.from;
            to = customRange.to;
            format = '%Y-%m-%d';
        } else {
            const config = getDateConfig(period);
            from = config.from;
            format = config.format;
        }

        const timelineMatch: Record<string, unknown> = {
            status: 'completed',
            type: 'credit',
            purpose: { $in: ['commission', 'subscription_payment'] },
            createdAt: { $gte: from, ...(to ? { $lte: to } : {}) }
        };

        const [totals, timeline] = await Promise.all([
            // all-time total — KPI card is never date-filtered
            TransactionModel.aggregate([
                { $match: { status: 'completed', type: 'credit', purpose: { $in: ['commission', 'subscription_payment'] } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            // timeline — filtered by period or custom range
            TransactionModel.aggregate([
                { $match: timelineMatch },
                { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, amount: { $sum: '$amount' } } },
                { $sort: { _id: 1 } }
            ])
        ]);
        return {
            total: totals[0]?.total ?? 0,
            timeline: timeline.map(t => ({ label: t._id, amount: t.amount }))
        };
    }
    async isTransactionReleased(transactionId: string): Promise<boolean> {
        const transaction = await TransactionModel.findOneAndUpdate({
            _id: transactionId, isReleased: false
        }, { $set: { isReleased: true } }, { new: true });
        return !!transaction
    }
}