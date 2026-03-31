import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IReviewRepository } from "../../../../domain/interfaces/IReviewRepository";
import { IGetSellerReviewUseCase } from "../../Usecase Interfaces/Review-Interface/IGetSellerReviewUseCase";
import { ReviewResponseDTO } from "../../../dtos/ReviewDTO";
import { ReviewDTOMapper } from "../../../DTOMapper/ReviewDTOMapper";

@injectable()
export class GetSellerReviewUseCase implements IGetSellerReviewUseCase{
    constructor(
        @inject(TYPES.ReviewRepository) private _reviewRepo:IReviewRepository
    ){}
    async execute(sellerId: string, page: number, limit: number): Promise<{ reviews: ReviewResponseDTO[]; total: number; averageRating: number; }> {
        const [result,stats]= await Promise.all([
            this._reviewRepo.findBySellerId(sellerId,page,limit),
            this._reviewRepo.getSellerAverageRating(sellerId)
        ]);
        return{
            reviews:result.reviews.map(ReviewDTOMapper.toDTO),
            total:result.total,
            averageRating:stats.averageRating
        }
    }
}