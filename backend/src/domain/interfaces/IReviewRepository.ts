import { Review } from "../entities/Review.entity";


export interface IReviewRepository{
    create(review:Review):Promise<Review>;
    findByAuctionId(auctionId:string):Promise<Review | null>;
    findBySellerId(sellerId:string,page:number,limit:number):Promise<{reviews:Review[];total:number}>;
    getSellerAverageRating(sellerId:string):Promise<{averageRating:number;totalReviews:number}>;
}