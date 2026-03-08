import cron from "node-cron";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { ICloseExpiredAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";
import { ISubscriptionRepository } from "../../domain/interfaces/ISubscriptionRepository";
import { IAuctionRepository } from "../../domain/interfaces/IAuctionRepository";
import { ISocketService } from "../../domain/interfaces/ISocketService";



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

    cron.schedule('* * * * *',async ()=>{
        try{
            const auctionRepo=container.get<IAuctionRepository>(TYPES.AuctionRepository);
            const socketService=container.get<ISocketService>(TYPES.SocketService);
            const auctions=await auctionRepo.findAuctionstoStart();
            for(const auction of auctions){
                await auctionRepo.updateAuctionStatus(auction.id!,'active');
                console.log(`[Cron] Auto started Auction`);
                socketService.emit('auction_started',{
                    auctionId:auction.id
                },auction.id!);
            }
            }catch(error){
                console.error("Error auto start auctions",error);
        }
    })


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