import { Wallet } from "../entities/Wallet.entity";
import { Transactions } from "../entities/Transaction.entity";


export interface IWalletRepository {
    findByUserId(userId: string): Promise<Wallet | null>;
    create(userId: string): Promise<Wallet>;
    credit(userId: string, amount: number): Promise<Wallet>;
    debit(userId: string, amount: number): Promise<Wallet>;
    getTransactions(userId: string): Promise<Transactions[]>;
    createTransactions(data: Partial<Transactions>): Promise<Transactions>;
    updateTransactions(transactionId: string, status: string): Promise<void>;
    findTransactionByIntentId(stripePaymentIntentId: string): Promise<Transactions | null>;
}
