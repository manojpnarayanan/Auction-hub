import cron from 'node-cron';
import { AuctionModel } from '../database/models/AuctionModel';


export function startPaymentTimeoutJob(){
    cron.schedule('*/5 * * * *',async()=>{
        try{
            console.log("Running payment Timeout Check..");
            const oneHourAgo=new Date();
            oneHourAgo.setHours(oneHourAgo.getHours()-1);
            const expiredAuctions=await AuctionModel.find({
                status:'sold',
                paymentStatus:'pending',
                endDate:{$lt:oneHourAgo}
            });
            for(const auction of expiredAuctions){
                if(auction.bids && auction.bids.length>1){
                    const currentWinnerIndex=auction.bids.findIndex(bid=>bid.bidderId=== auction.winnerId)
                    const nextWinnerIndex=currentWinnerIndex+1
                    if(nextWinnerIndex<auction.bids.length){
                        const nextBidder=auction.bids[nextWinnerIndex];
                        auction.winnerId=nextBidder.bidderId;
                        auction.currentPrice=nextBidder.amount;
                        auction.endDate=new Date();
                        await auction.save();
                    }else{
                    auction.status='expired';
                    await auction.save();
                    }
                }else{
                    auction.status='expired';
                    await auction.save();
                    }
            }
        }catch(error){
            console.error("Erron in payment Timeout",error);
        }
    })
}