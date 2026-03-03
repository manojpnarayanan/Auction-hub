import cron from "node-cron";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { ICloseExpiredAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";
import { ISubscriptionRepository } from "../../domain/interfaces/ISubscriptionRepository";



export function startCronJobs():void{
    // console.log("[Cron] Starting cron jobs");
    cron.schedule("* * * * *",async ()=>{
        // console.log("[Cron] Checking for ExpiredAuctions");
        try{
            const closeExpiredAuctionsUseCase=container.get<ICloseExpiredAuctionUseCase>(
                TYPES.CloseExpiredAuctionsUseCase);
                await closeExpiredAuctionsUseCase.execute();
        }catch(error){
            console.log("[Cron] error closing expired auctions ", error);
        }
    });
    // console.log("[Cron] Cron jobs started successfully");
    cron.schedule('0 0 * * *',async()=>{
        try{
            const subscriptionRepo=container.get<ISubscriptionRepository>(TYPES.SubscriptionRepository);
            await subscriptionRepo.expireOldPlans();
            console.log('[Cron] expired old subscription plans')
        }catch(error){
            console.error('[Cron] error expiring susbcription plans:',error);
        }
    })
}