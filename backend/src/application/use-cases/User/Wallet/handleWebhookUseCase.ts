import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { IHandleWebhookUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IHandleWebhookUseCase";
import { config } from "../../../../infrastructure/config/environment";

@injectable()
export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository
    ) { }
    
    async execute(payload: Buffer, signature: string): Promise<void> {
        const event = this._paymentService.constructWebhookEvent(payload, signature, config.stripeWebhook) as {
            type: string; data: { object: { id: string; amount: number; metadata: Record<string, string> } }
        };
        
        if (event.type === 'payment_intent.succeeded') {
            const intent = event.data.object;
            const adminId = process.env.ADMIN_WALLET_USER_ID!;

            //  Check if we already processed this
            const existing = await this._walletRepository.findTransactionByIntentId(intent.id);
            if (existing && existing.status === 'completed') return;

            await this._walletRepository.credit(adminId, intent.amount / 100);
            
            //  Create or Update the Escrow Transaction record
            const adminWallet = await this._walletRepository.findByUserId(adminId);
            if (adminWallet) {
                if (!existing) {
                    // Record missing (User was redirected)! Create it now.
                    await this._walletRepository.createTransactions({
                        walletId: adminWallet.id,
                        userId: adminId,
                        amount: intent.amount / 100,
                        type: 'credit',
                        status: 'completed',
                        purpose: 'auction_payment',
                        auctionId: intent.metadata.auctionId,
                        stripePaymentIntentId: intent.id,
                        description: `Payment received for auction ${intent.metadata.auctionId} (via Webhook)`,
                        isReleased: false
                    });
                } else {
                    // Record exists, just mark it completed
                    await this._walletRepository.updateTransactions(intent.id, 'completed');
                }
            }
            
            //  Update Auction Status
            if (intent.metadata && intent.metadata.auctionId) {
                await this._auctionRepository.updatePaymentStatus(intent.metadata.auctionId, 'completed');
                logger.info(`Auction ${intent.metadata.auctionId} finalized via Webhook.`);
            }
        }
    }
}
