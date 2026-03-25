export interface AuctionItem{
    id:string;
    title:string;
    currentPrice:number;
    startingPrice:number;
    images?:string[];
    status:string;
    type:string;
    sellerId:string;
    description?:string;
    category:string;
    endDate:Date | string;
    startTime?:Date |string;
    image?:string;
    rejectionReason?:string;
    cancellationReason?:string;
    paymentStatus?:'pending' | 'completed';
    deliveryStatus?:'pending_delivery'| 'delivered'|'disputed';
}