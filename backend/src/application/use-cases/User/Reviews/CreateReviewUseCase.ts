import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IReviewRepository } from "../../../../domain/interfaces/IReviewRepository";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { ICreateReviewUseCase } from "../../Usecase Interfaces/Review-Interface/ICreateReviewUseCase";
import { CreateReviewDTO } from "../../../dtos/ReviewDTO";
import { Review } from "../../../../domain/entities/Review.entity";
import { ValidationError,NotFoundError } from "../../../../domain/errors/errors";


@injectable()
export class CreateReviewUseCase implements ICreateReviewUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepo:IAuctionRepository,
        @inject(TYPES.ReviewRepository) private _reviewRepo:IReviewRepository
    ){}
    async execute(data: CreateReviewDTO): Promise<void> {
        const auction=await this._auctionRepo.findById(data.auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        if(auction.status !== 'sold' ) throw new ValidationError("Review can only add for sold Auctions");
        if(auction.winnerId !== data.buyerId) throw new ValidationError("Only the buyer can leac=ve a review");
        const existingReview=await this._reviewRepo.findByAuctionId(data.auctionId);
        if(existingReview) throw new ValidationError("You have submitted review already");

        const newReview=new Review(
            data.auctionId,
            data.buyerId,
            auction.sellerId,
            data.rating,
            data.comment
        )
        await this._reviewRepo.create(newReview);
    }
}