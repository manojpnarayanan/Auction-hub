import cron from "node-cron";
import container from "../../di/container";
import {TYPES} from "../../di/types";
import { ICloseExpiredAuctionUseCase } from "../../application/use-cases/Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";


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
}