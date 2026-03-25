

export interface RaiseDisputeDTO{
    auctionId:string;
    buyerId:string;
    sellerId:string;
    reason:string;
}

export interface ResolveDisputeDTO{
    disputedId:string;
    resolution:'refund' | 'reject';
    adminNote:string;
}
export interface DisputeResponseDTO{
    id:string;
    auctionId:string;
    buyerId:string;
    sellerId:string;
    reason:string;
    status: 'open' | 'under_review' | 'resolved_refunded' | 'resolved_rejected';
    adminNote?:string;
    createdAt:Date;
}
