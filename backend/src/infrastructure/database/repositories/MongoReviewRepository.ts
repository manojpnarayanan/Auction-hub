import { injectable } from "inversify";
import { IReviewRepository } from "../../../domain/interfaces/IReviewRepository";
import { Review } from "../../../domain/entities/Review.entity";
import { ReviewModel,IReviewDocument } from "../models/ReviewModel";
import { ReviewPersistanceMapper } from "../Mappers/ReviewPersistanceMapper";
import { BaseRepository } from "./BaseRepository";
import mongoose from "mongoose";


@injectable()

export class MongoReviewRepository extends BaseRepository<Review,IReviewDocument> implements IReviewRepository{
    constructor(){
        super(ReviewModel,ReviewPersistanceMapper.toEntity)
    }
    async findByAuctionId(auctionId: string): Promise<Review | null> {
        const doc=await ReviewModel.findOne({auctionId});
        return doc? ReviewPersistanceMapper.toEntity(doc) : null
    }
    async findBySellerId(sellerId: string, page: number, limit: number): Promise<{ reviews: Review[]; total: number; }> {
        const skip=(page-1)*limit;
        const total=await ReviewModel.countDocuments({sellerId});
        const doc=await ReviewModel.find({sellerId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)

        return{
            reviews:doc.map(ReviewPersistanceMapper.toEntity),total
        }
    }
    async getSellerAverageRating(sellerId: string): Promise<{ averageRating: number; totalReviews: number; }> {
        const result=await ReviewModel.aggregate([
            {$match:{sellerId:new mongoose.Types.ObjectId(sellerId)}},
            {$group:{_id:null,averageRating:{$avg:'$rating'},totalReviews:{$sum:1}}}
        ]);
        if(result.length === 0){
            return {averageRating:0,totalReviews:0}
        }
        return {
            averageRating:Math.round(result[0].averageRating*10)/10,totalReviews:result[0].totalReviews
        }
    }
}