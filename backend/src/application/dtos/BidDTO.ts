export interface PlaceBidDTO {
    auctionId: string,
    bidderId: string,
    amount: number
}
export interface BidResponseDTO{
    id:string;
    auctionId:string;
    bidderId:string;
    amount:number;
    time:Date;
}
export interface AuctionBidResponseDTO{
    id:string;
    amount:number;
    time:Date;
    bidderName:string;
    bidderImage:string;
}

export type BidStatusType = "winning" | 'outbid' | 'won' | 'lost';

export interface AuctionSummaryDTO {
    id: string,
    title: string,
    description: string,
    category: string,
    currentPrice: number,
    startingPrice: number,
    endDate: Date,
    status: 'active' | 'sold' | 'expired' | 'pending' | 'rejected' | 'cancelled' | 'pending_cancellation',
    images: string[];
    type: 'live' | 'timed',
    paymentStatus?:string;
    deliveryStatus?:string;
}

export interface UserBidResponseDTO {
    auction: AuctionSummaryDTO,
    myHighestBid: number,
    isHighestBidder: boolean;
    status: BidStatusType;
    lastBidTime: Date;
}