import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { ICloseExpiredAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/ICloseExpiredAuctionUseCase";


@injectable()

export class CloseExpiredAuctionUseCase implements ICloseExpiredAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ){ }
     async execute(): Promise<void> {
         const now=new Date();
         const expiredAuctions=await this.auctionRepository.findExpiredActiveAuctions();
        //  console.log(`[Cron] found ${expiredAuctions.length} expired Auctions`);
         for(const auction of expiredAuctions){
            if(auction.bids && auction.bids.length>0){
                const highestBid=auction.bids.reduce((max,bid)=>bid.amount>max.amount? bid:max)
                await this.auctionRepository.updateAuctionStatus(auction.id!,'sold',highestBid.bidderId);
                // console.log(`[Cron ] Auction ${auction.id} marked as SOLD to ${highestBid.bidderId}`);
            }else{
                await this.auctionRepository.updateAuctionStatus(auction.id!,'expired');
                // console.log(`[Cron] Auction ${auction.id} marked as Expired`);
            }
         }
     }
}