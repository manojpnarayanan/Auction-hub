import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWalletRepository } from "../../../../domain/interfaces/IWalletRepository";
import { TransactionResponseDTO } from "../../../dtos/WalletDTO";
import { IGetPendingReleaseUseCase } from "../../Usecase Interfaces/Wallet-interfaces/IGetPendingUseCase";
import { ISubscriptionRepository } from "../../../../domain/interfaces/ISubscriptionRepository";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/ISubscriptionPlanRepository";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";


@injectable()
export class GetPendingReleaseUseCase implements IGetPendingReleaseUseCase{
    constructor(
        @inject(TYPES.WalletRepository) private _walletRepository:IWalletRepository,
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepo:ISubscriptionRepository,
        @inject(TYPES.AuctionRepository)private _auctionRepository:IAuctionRepository,
        @inject(TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepo:ISubscriptionPlanRepository
    ){}
    async execute(): Promise<TransactionResponseDTO[]> {
        const adminId=process.env.ADMIN_WALLET_USER_ID;
        if(!adminId) throw new Error("Admin id not has Wallet");

        const pendingEntities=await this._walletRepository.getPendingRelease(adminId);
        
        const enrichedTransactions=await Promise.all(pendingEntities.map(async(doc)=>{
            let commissionPercent=0;
            let sellerId="";
            if(doc.auctionId){
                const auction=await this._auctionRepository.findById(doc.auctionId);
                if(auction){
                    sellerId=auction.sellerId
                    const sub=await this._subscriptionRepo.findActiveByUSerId(sellerId);
                    let plan=sub? await this._subscriptionPlanRepo.findById(sub.planId) : null;
                    if(!plan) plan=await this._subscriptionPlanRepo.findDefaultPlan();
                    if(plan) commissionPercent=plan.commission
                }
            }
            return {
            id:doc.id,
            amount:doc.amount,
            type:doc.type,
            status:doc.status,
            purpose:doc.purpose,
            description:doc.description,
            auctionId:doc.auctionId,
            createdAt:doc.createdAt.toISOString(),
            commissionPercent,
            sellerId
            }
        }));
        
        return enrichedTransactions
        
        
}
}