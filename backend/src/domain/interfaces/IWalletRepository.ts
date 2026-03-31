import { Wallet } from "../entities/Wallet.entity";
import { Transactions } from "../entities/Transaction.entity";


export interface IWalletRepository {
    findByUserId(userId: string): Promise<Wallet | null>;
    create(wallet: Wallet): Promise<Wallet>;
    credit(userId: string, amount: number): Promise<Wallet>;
    debit(userId: string, amount: number): Promise<Wallet>;
    getTransactions(userId: string, page?: number, limit?: number): Promise<{ transactions: Transactions[], total: number }>;
    createTransactions(data: Partial<Transactions>): Promise<Transactions>;
    updateTransactions(transactionId: string, status: string): Promise<void>;
    findTransactionByIntentId(stripePaymentIntentId: string): Promise<Transactions | null>;
    getPendingRelease(adminId: string): Promise<Transactions[]>;
    markTransactionAsReleased(transactionId: string): Promise<void>;
    getTotalRevenue(period: 'daily' | 'monthly' | 'yearly', customRange?: { from: Date; to: Date }): Promise<{ total: number; timeline: { label: string; amount: number }[] }>;
    isTransactionReleased(transactionId: string): Promise<boolean>;
}
