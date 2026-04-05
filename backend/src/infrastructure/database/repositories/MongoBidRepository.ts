import { injectable } from "inversify";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { Bid } from "../../../domain/entities/Bid.entity";
import { BidModel, IBidDocument } from "../models/BidModel";
import { PipelineStage } from "mongoose";
import { BidpersistanceMapper } from "../Mappers/BidPersistanceMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()

export class MongoBidRepository extends BaseRepository<Bid,IBidDocument> implements IBidRepository {
    constructor(){super(BidModel,BidpersistanceMapper.toEntity)}
    
    async findByAuctionId(auctionId: string): Promise<Bid[]> {
        const docs = await BidModel.find({ auctionId }).sort({ amount: -1 });
        return docs.map(d => new Bid(d.auctionId, d.bidderId, d.amount, d.time, d.id.toString()));
    }
   async findByBidderId(bidderId: string, page: number, limit: number): Promise<{ bids: Bid[], total: number }> {
    const skip = (page - 1) * limit;

    const aggregatePipeline: PipelineStage[] = [
    { $match: { bidderId } },
    { $sort: { time: -1 } },
    {
        $group: {
            _id: '$auctionId',
            highestBid: { $first: '$$ROOT' } as any,
            latestTime: { $max: "$time" }
        }
    },
    {
        $addFields: {
            convertedId: { $toObjectId: "$_id" }
        }
    },
    {
        $lookup: {
            from: 'auctions', 
            localField: 'convertedId',
            foreignField: '_id',
            as: 'auctionDetails'
        }
    },
    { $match: { "auctionDetails.0": { $exists: true } } },
];


    const totalResult = await BidModel.aggregate([
        ...aggregatePipeline,
        { $count: 'count' }
    ]);
    const total = totalResult[0]?.count || 0;

    const paginatedAuctions = await BidModel.aggregate([
        ...aggregatePipeline,
        { $sort: { latestTime: -1 } },
        { $skip: skip },
        { $limit: limit }
    ]);

    const bids = paginatedAuctions.map(p => {
        const d = p.highestBid;
        return new Bid(d.auctionId, d.bidderId, d.amount, d.time, d._id.toString());
    });

    return { bids, total };
}
}