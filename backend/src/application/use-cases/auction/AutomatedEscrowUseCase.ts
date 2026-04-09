import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IWalletRepository } from "../../../domain/interfaces/IWalletRepository";
import { IReleasePaymentUseCase } from "../Usecase Interfaces/Wallet-interfaces/IReleasePaymentUseCase";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import {IAutomatedEscrowReleaseUseCase} from '../Usecase Interfaces/Auction-Interface/IAutomatedEscrowReleaseUseCase'
import logger from "../../../infrastructure/Global/Logger";


@injectable()
export class AutomatedEscrowUseCase implements IAutomatedEscrowReleaseUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) 
        private _auctionRepository:IAuctionRepository,
        @inject(TYPES.UserRepository) 
        private _userRepository:IUserRepository,
        @inject(TYPES.ReleasePaymentUseCase) 
        private _releasePaymentUseCase:IReleasePaymentUseCase,
        @inject(TYPES.WalletRepository) 
        private _walletRepository:IWalletRepository
    ){}
        async execute(): Promise<void> {
        try {
            const thresholdDate = new Date();
            
            thresholdDate.setDate(thresholdDate.getDate() - 3);
            // thresholdDate.setMinutes(thresholdDate.getMinutes() - 3);
            
            logger.info(`[Auto-Escrow] Checking for auctions paid before ${thresholdDate.toISOString()}`);

            const eligibleAuctions = await this._auctionRepository.findPaidAuctions(thresholdDate);
            
            if (!eligibleAuctions || eligibleAuctions.length === 0) {
                logger.info("[Auto-Escrow] No auctions found for automatic release.");
                return;
            }

            for (const auction of eligibleAuctions) {
                try {
                    const admin = await this._userRepository.findAdmin();
                    if (!admin) {
                        logger.error("[Auto-Escrow] Admin not found");
                        continue;
                    }

                    const pendingTransactions = await this._walletRepository.getPendingRelease(admin.id);
                    const escrowTX = pendingTransactions.find(tx => tx.auctionId?.toString() === auction.id);

                    if (escrowTX && escrowTX.id) {
                        logger.info(`[Auto-Escrow] Automatically releasing funds for auction: ${auction.id}`);

                        
                        await this._auctionRepository.update(auction.id!, { deliveryStatus: 'delivered' });

                        
                        await this._releasePaymentUseCase.execute({
                            auctionId: auction.id!,
                            sellerId: auction.sellerId,
                            buyerId:auction.winnerId!,
                            amount: escrowTX.amount,
                            transactionId: escrowTX.id,
                            commissionPercent: 0,
                            sellerAmount: 0,
                            isAutomatic:true
                        });
                        
                        logger.info(`[Auto-Escrow] Successfully released funds for ${auction.id}`);
                    } else {
                        logger.warn(`[Auto-Escrow] Payment confirmed but no pending escrow found for ${auction.id}`);
                    }
                } catch (_error) {
                    logger.error(`[Auto-Escrow] Failed to process release for auction ${auction.id}:`);
                }
            }
        } catch (_error) {
            logger.error("[Auto-Escrow] Critical error in automated release check:");
        }
    }

}