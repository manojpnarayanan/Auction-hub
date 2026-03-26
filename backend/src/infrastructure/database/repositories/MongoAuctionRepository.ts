import { injectable } from "inversify";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionModel, IAuctionDocument } from "../models/AuctionModel";
import { AuctionPersistanceMapper } from "../Mappers/AuctionPersistanceMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()

export class MongoAuctionRepository extends BaseRepository<Auction, IAuctionDocument> implements IAuctionRepository {
    constructor() {
        super(AuctionModel, AuctionPersistanceMapper.toEntity)
    }
    async findAll(filters?: {
        category?: string,
        search?: string;
        type?: string;
        status?: string;
        page?: number;
        limit?: number,
    }): Promise<{ auction: Auction[], total: number }> {
        const query: Record<string, unknown> = {};
        if (filters?.status && filters.status !== 'all') {
            // query.status = filters.status
            if (filters.status === 'active') {
                query.status = { $in: ['active', 'approved'] }
            } else {
                query.status = filters.status
            }
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
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;
        const total = await AuctionModel.countDocuments(query);
        const auctions = await AuctionModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        return { auction: auctions.map(AuctionPersistanceMapper.toEntity), total }
    }
    async findBySellerId(sellerId: string, page: number, limit: number): Promise<{ auctions: Auction[], total: number }> {
        const skip = (page - 1) * limit;
        const query = { sellerId };
        const total = await AuctionModel.countDocuments(query);

        const auctions = await AuctionModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        return { auctions: auctions.map(AuctionPersistanceMapper.toEntity), total };
    }

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

    async findExpiredActiveAuctions(): Promise<Auction[]> {
        const now = new Date();
        const expiredAuctions = await AuctionModel.find({ status: "active", endDate: { $lt: now } });
        return expiredAuctions.map(AuctionPersistanceMapper.toEntity)
    }

    async updateAuctionStatus(id: string, status: string, winnerId?: string, rejectionReason?: string, cancellationReason?: string): Promise<void> {
        const updateData: { status: string, winnerId?: string, rejectionReason?: string, cancellationReason?: string } = { status };
        if (winnerId) {
            updateData.winnerId = winnerId
        }
        if (rejectionReason) updateData.rejectionReason = rejectionReason;
        if (cancellationReason) updateData.cancellationReason = cancellationReason;
        await AuctionModel.findByIdAndUpdate(id, updateData);
    }

    async updatePaymentStatus(auctionId: string, status: string): Promise<void> {
        await AuctionModel.findByIdAndUpdate(auctionId, { paymentStatus: status })
    }

    async recalculateCurrentPrice(auctionId: string): Promise<void> {
        const auction = await AuctionModel.findById(auctionId);
        if (!auction) return;
        const highestBid = auction.bids.reduce((max, bid) => bid.amount ? bid.amount : max, auction.startingPrice);
        await AuctionModel.findByIdAndUpdate(auctionId, { currentPrice: highestBid });
    }
    async findAuctionstoStart(): Promise<Auction[]> {
        const now = new Date();
        const auctions = await AuctionModel.find({ status: 'approved', startTime: { $lte: now } });
        return auctions.map(AuctionPersistanceMapper.toEntity);
    }
    async getAuctionStats(): Promise<{ sold: number; expired: number; pending: number; approved: number; active: number; }> {
        const [sold, expired, pending, approved, active] = await Promise.all([
            AuctionModel.countDocuments({ status: 'sold' }),
            AuctionModel.countDocuments({ status: 'expired' }),
            AuctionModel.countDocuments({ status: 'pending' }),
            AuctionModel.countDocuments({ status: 'approved' }),
            AuctionModel.countDocuments({ status: 'active' })
        ])
        return { sold, expired, pending, approved, active };
    }
}