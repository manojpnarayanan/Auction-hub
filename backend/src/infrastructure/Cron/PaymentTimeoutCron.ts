import cron from 'node-cron';
import { AuctionModel } from '../database/models/AuctionModel';

export function startPaymentTimeoutJob() {
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log("Running payment Timeout Check..");
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);
            
            const expiredAuctions = await AuctionModel.find({
                status: 'sold',
                paymentStatus: 'pending',
                endDate: { $lt: oneHourAgo }
            });
            
            for (const auction of expiredAuctions) {
                if (auction.bids && auction.bids.length > 0) {
                    // Extract unique bidders array sorted by highest bid
                    const uniqueBidders: any[] = [];
                    const seen = new Set();
                    
                    const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
                    for (const bid of sortedBids) {
                        if (!seen.has(bid.bidderId)) {
                            seen.add(bid.bidderId);
                            uniqueBidders.push(bid);
                        }
                    }

                    // Find the current defaulting winner in the ordered list
                    const currentWinnerIndex = uniqueBidders.findIndex(bid => bid.bidderId === auction.winnerId);
                    const nextWinnerIndex = currentWinnerIndex + 1;

                    // If they exist and there is another bidder behind them
                    if (currentWinnerIndex !== -1 && nextWinnerIndex < uniqueBidders.length) {
                        const nextBidder = uniqueBidders[nextWinnerIndex];
                        auction.winnerId = nextBidder.bidderId;
                        auction.currentPrice = nextBidder.amount;
                        // Reset the 1-hour clock starting from NOW for the new winner
                        auction.endDate = new Date(); 
                        await auction.save();
                        console.log(`Auction ${auction._id} shifted to next winner: ${nextBidder.bidderId}`);
                    } else {
                        // Nobody left to shift to!
                        auction.status = 'expired';
                        await auction.save();
                        console.log(`Auction ${auction._id} fully expired.`);
                    }
                } else {
                    auction.status = 'expired';
                    await auction.save();
                }
            }
        } catch (error) {
            console.error("Error in payment Timeout", error);
        }
    })
}
