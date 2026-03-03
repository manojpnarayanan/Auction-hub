import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types';
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { IPaymentService } from "../../../../domain/interfaces/IPaymentService";
import { IHandleWebhookUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IHandleWebhookUseCase";
import { config } from "../../../../infrastructure/config/environment";


@injectable()
export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService
    ) { }
    async execute(payload: Buffer, signature: string): Promise<void> {
        const event = this._paymentService.constructWebhookEvent(payload, signature, config.stripeWebhook) as {
            type: string; data: { object: { id: string; amount: number; metadata: Record<string, string> } }
        };
        if (event.type === 'payment_intent.succeeded') {
            const intent = event.data.object;
            const adminId = process.env.ADMIN_WALLET_USER_ID!;

            // Idempotency check — skip if already processed
            const existing = await this._walletRepository.findTransactionByIntentId(intent.id);
            if (existing && existing.status === 'completed') {
                console.log('Webhook already processed, skipping:', intent.id);
                return;
            }

            await this._walletRepository.credit(adminId, intent.amount / 100);
            await this._walletRepository.updateTransactions(intent.id, 'completed');
        }
    }
}