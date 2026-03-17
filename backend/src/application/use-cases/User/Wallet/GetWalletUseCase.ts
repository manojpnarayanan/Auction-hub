import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { Wallet } from "../../../../domain/entities/Wallet.entity";
import { IGetWalletUseCase, WalletWithTransactions } from "../../Usecase Interfaces/Wallet-interfaces/IGetWalletUseCase";




@injectable()
export class GetWalletUseCase implements IGetWalletUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository
    ){}
    async execute(userId: string, page: number = 1, limit: number = 10): Promise<WalletWithTransactions> {
        let wallet = await this._walletRepository.findByUserId(userId);
        if (!wallet) {
            const newWallet=new Wallet("",userId,0,'inr',new Date(),new Date())
            wallet = await this._walletRepository.create(newWallet);
        }
        const { transactions, total } = await this._walletRepository.getTransactions(userId, page, limit);
        return {
            wallet: {
                id: wallet.id,
                userId: wallet.userId,
                balance: wallet.balance,
                currency: wallet.currency,
            },
            transactions: transactions.map(t => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                status: t.status,
                purpose: t.purpose,
                description: t.description,
                auctionId: t.auctionId,
                createdAt: t.createdAt.toISOString()
            })),
            total
        };
    }
}