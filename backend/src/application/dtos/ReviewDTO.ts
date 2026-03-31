
export interface CreateReviewDTO{
    auctionId:string;
    buyerId:string;
    sellerId:string;
    rating:number;
    comment:string;
}

export interface ReviewResponseDTO{
    id:string;
    auctionId:string;
    buyerId:string;
    sellerId:string;
    rating:number;
    comment:string;
    createdAt:Date;
}