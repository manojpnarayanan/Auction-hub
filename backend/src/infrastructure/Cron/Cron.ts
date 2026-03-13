import cron from "node-cron";
import logger from "../Global/Logger";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { ICloseExpiredAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";
import { ISubscriptionRepository } from "../../domain/interfaces/ISubscriptionRepository";
import { IAuctionRepository } from "../../domain/interfaces/IAuctionRepository";
import { ISocketService } from "../../domain/interfaces/ISocketService";



export function startCronJobs():void{
    // logger.info("[Cron] Starting cron jobs");
    cron.schedule("* * * * *",async ()=>{
        // logger.info("[Cron] Checking for ExpiredAuctions");
        try{
            const closeExpiredAuctionsUseCase=container.get<ICloseExpiredAuctionUseCase>(
                TYPES.CloseExpiredAuctionsUseCase);
                await closeExpiredAuctionsUseCase.execute();
        }catch(error){
            logger.info({ error }, "[Cron] error closing expired auctions ");
        }
    });

    cron.schedule('* * * * *',async ()=>{
        try{
            const auctionRepo=container.get<IAuctionRepository>(TYPES.AuctionRepository);
            const socketService=container.get<ISocketService>(TYPES.SocketService);
            const auctions=await auctionRepo.findAuctionstoStart();
            for(const auction of auctions){
                await auctionRepo.updateAuctionStatus(auction.id!,'active');
                logger.info(`[Cron] Auto started Auction`);
                socketService.emit('auction_started',{
                    auctionId:auction.id
                },auction.id!);
            }
            }catch(error){
                logger.error({ error }, "Error auto start auctions");
        }
    })


    // logger.info("[Cron] Cron jobs started successfully");
    cron.schedule('0 0 * * *',async()=>{
        try{
            const subscriptionRepo=container.get<ISubscriptionRepository>(TYPES.SubscriptionRepository);
            await subscriptionRepo.expireOldPlans();
            logger.info('[Cron] expired old subscription plans')
        }catch(error){
            logger.error({ error }, '[Cron] error expiring susbcription plans:');
        }
    })
}