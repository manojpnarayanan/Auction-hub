import { ReviewResponseDTO } from "../../../dtos/ReviewDTO";


export interface IGetSellerReviewUseCase{
    execute(sellerId:string,page:number,limit:number):Promise<{reviews:ReviewResponseDTO[];total:number;averageRating:number}>;
}