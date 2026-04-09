import { injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { IDisputeRepository } from "../../../domain/interfaces/IDisputeRepository";
import { Dispute } from "../../../domain/entities/Dispute.entity";
import { DisputeModel, IDisputeDocument } from "../models/DisputeModel";
import { DisputePersistanceMapper } from "../Mappers/DisputePersistanceMapper";
import { FilterQuery } from "mongoose";

@injectable()
export class MongoDisputeRepository extends BaseRepository<Dispute, IDisputeDocument> implements IDisputeRepository {
    constructor() {
        super(DisputeModel, DisputePersistanceMapper.toEntity);
    }
    async findByAuctionId(auctionId: string): Promise<Dispute | null> {
        const doc = await DisputeModel.findOne({ auctionId });
        return doc ? DisputePersistanceMapper.toEntity(doc) : null
    }
    async findByBuyerId(buyerId: string, page: number, limit: number): Promise<{ dispute: Dispute[]; total: number; }> {
        const query: FilterQuery<IDisputeDocument> = { buyerId };
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            DisputeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('auctionId','title').populate('buyerId','name email').populate('sellerId','name email'),
            DisputeModel.countDocuments(query)
        ]);
        return { dispute: docs.map(DisputePersistanceMapper.toEntity), total };
    }

    async findAll(page: number, limit: number, status?: string): Promise<{ disputes: Dispute[]; total: number; }> {
        const query: FilterQuery<IDisputeDocument> = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            DisputeModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip).limit(limit)
                .populate('auctionId','title')
                .populate('buyerId','name email')
                .populate('sellerId','name email'),
            DisputeModel.countDocuments(query)
        ]);
        return { disputes: docs.map(DisputePersistanceMapper.toEntity), total }
    }
    async updateStatus(id: string, status: string, adminNote?: string): Promise<void> {
        const updateData: FilterQuery<IDisputeDocument> = { status };
        if (adminNote) updateData.adminNote = adminNote;

        await DisputeModel.findByIdAndUpdate(id, updateData);
    }
}