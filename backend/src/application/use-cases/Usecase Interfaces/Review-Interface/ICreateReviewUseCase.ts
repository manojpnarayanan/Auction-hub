import { CreateReviewDTO } from "../../../dtos/ReviewDTO";


export interface ICreateReviewUseCase{
    execute(data:CreateReviewDTO):Promise<void>;
}