import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { releasePaymentDTO } from "../../../dtos/WalletDTO";
import { IReleasePaymentUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { config } from "../../../../infrastructure/config/environment";



@injectable()
export class ReleasePaymentUseCase implements IReleasePaymentUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private walletRepository:IWalletRepository
    ){}
    async execute(data: releasePaymentDTO): Promise<void> {
        const percent=data.commissionPercent;
        const commission=Math.round((data.amount*data.commissionPercent)/100);
        const sellerAmount=data.amount-commission;
        await this.walletRepository.credit(data.sellerId,sellerAmount);
        await this.walletRepository.createTransactions({
            userId:data.sellerId,
            amount:sellerAmount,
            type:'credit',
            status:'completed',
            purpose:'seller_credit',
            auctionId:data.auctionId,
            description:`Auction payout for auction ${data.auctionId}`
        })
        const adminId=process.env.ADMIN_WALLET_USER_ID!;
        await this.walletRepository.credit(adminId,commission);
        await this.walletRepository.createTransactions({
            userId:adminId,
            amount:commission,
            type:'credit',
            status:'completed',
            purpose:'commission',
            auctionId:data.auctionId,
            description:`Commission (${percent} %) from auction ${data.auctionId}`
        });
    }
}