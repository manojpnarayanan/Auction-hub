import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IGetWalletUseCase, WalletWithTransactions } from "../../Usecase Interfaces/Wallet-interfaces/IGetWalletUseCase";




@injectable()
export class GetWalletUseCase implements IGetWalletUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private walletRepository:IWalletRepository
    ){}
    async execute(userId: string): Promise<WalletWithTransactions> {
        let wallet=await this.walletRepository.findByUserId(userId);
        if(!wallet){
            wallet=await this.walletRepository.create(userId);
        }
        const transactions=await this.walletRepository.getTransactions(userId);
        return {
            wallet:{
                id:wallet.id,
                userId:wallet.userId,
                balance:wallet.balance,
                currency:wallet.currency,
            },
            transactions:transactions.map(t=>({
                id:t.id,
                amount:t.amount,
                type:t.type,
                status:t.status,
                purpose:t.purpose,
                description:t.description,
                auctionId:t.auctionId,
                createdAt:t.createdAt.toISOString()
            })),
        };
    }
}