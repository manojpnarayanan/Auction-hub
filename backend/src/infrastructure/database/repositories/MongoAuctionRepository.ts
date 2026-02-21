import { injectable } from "inversify";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionModel, IAuctionDocument } from "../models/AuctionModel";
import { AuctionPersistanceMapper } from "../Mappers/AuctionPersistanceMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()

export class MongoAuctionRepository extends BaseRepository<Auction,IAuctionDocument> implements IAuctionRepository {
    constructor(){
        super(AuctionModel,AuctionPersistanceMapper.toEntity)
    }
    
    // async create(auction: Auction): Promise<Auction> {
    //     const newAuction = await AuctionModel.create(auction);
    //     return AuctionPersistanceMapper.toEntity(newAuction)
    // }
    async findAll(filters?: { 
        category?: string, 
        search?: string; 
        type?: string; 
        status?: string;
        page?:number;
        limit?:number,
     }): Promise<{auction:Auction[],total:number}> {
        const query: any = {};
        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status
        }
        if (filters?.category && filters.category !== "All") {
            query.category = filters.category
        }
        if (filters?.search) {
            const searchRegex = { $regex: filters.search, $options: "i" };
            query.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ]
        }
        if (filters?.type && filters.type !== 'all') {
            query.type = filters.type;
        }
        const page=filters?.page || 1;
        const limit=filters?.limit || 10;
        const skip=(page-1 )* limit;
        const total=await AuctionModel.countDocuments(query);
        const auctions = await AuctionModel.find(query)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        return {auction:auctions.map(AuctionPersistanceMapper.toEntity),total}
    }
    async findBySellerId(sellerId: string): Promise<Auction[]> {
        const auctions = await AuctionModel.find({ sellerId });
        return auctions.map(AuctionPersistanceMapper.toEntity);
    }
    // async findById(id: string): Promise<Auction | null> {
    //     const auction = await AuctionModel.findById(id);
    //     return auction ? AuctionPersistanceMapper.toEntity(auction) : null
    // }
    // async update(id: string, data: Partial<Auction>): Promise<Auction | null> {
    //     const updatedAuction = await AuctionModel.findByIdAndUpdate(id, data, { new: true })
    //     if (!updatedAuction) return null;
    //     return AuctionPersistanceMapper.toEntity(updatedAuction);
        
    // }
    async findByCategory(category: string): Promise<Auction[]> {
        const auctions = await AuctionModel.find({ category: category });
        return auctions.map(AuctionPersistanceMapper.toEntity);
    }

    async addBid(auctionId: string, bid: { bidderId: string; amount: number; time: Date; }): Promise<boolean> {
        const result = await AuctionModel.updateOne(
            { _id: auctionId },
            {
                $set: { currentPrice: bid.amount },
                $push: { bids: { $each: [bid], $sort: { amount: -1 }, $slice: 10 } }
            }
        );
        return result.modifiedCount > 0;
    }

    // async delete(id: string): Promise<boolean> {
    //     const result = await AuctionModel.deleteOne({ _id: id });
    //     return result.deletedCount > 0;
    // }

    async findExpiredActiveAuctions(): Promise<Auction[]> {
        const now = new Date();
        const expiredAuctions = await AuctionModel.find({ status: "active", endDate: { $lt: now } });
        return expiredAuctions.map(AuctionPersistanceMapper.toEntity)
    }

    async updateAuctionStatus(id: string, status: string, winnerId?: string): Promise<void> {
        const updateData: { status: string, winnerId?: string } = { status };
        if (winnerId) {
            updateData.winnerId = winnerId
        }
        await AuctionModel.findByIdAndUpdate(id, updateData);
    }



}