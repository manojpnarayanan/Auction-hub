

export interface RaiseDisputeDTO {
    auctionId: string;
    buyerId: string;
    sellerId: string;
    reason: string;
    evidence?:string;
}

export interface ResolveDisputeDTO {
    disputedId: string;
    resolution: 'refund' | 'reject';
    adminNote: string;
}
export interface DisputeResponseDTO {
    id: string;
    auctionId: string | { _id: string; title: string };
    buyerId: string | { _id: string; name: string; email: string };
    sellerId: string | { _id: string; name: string; email: string };
    reason: string;
    status: 'open' | 'under_review' | 'resolved_refunded' | 'resolved_rejected';
    adminNote?: string;
    evidence?:string;
    createdAt: Date;
}
