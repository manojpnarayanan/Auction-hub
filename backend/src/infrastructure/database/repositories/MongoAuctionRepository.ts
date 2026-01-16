import { injectable } from "inversify";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionModel } from "../models/AuctionModel";


@injectable()

export class MongoAuctionRepository implements IAuctionRepository{
    async create(auction:Auction):Promise<Auction>{
        const newAuction=await AuctionModel.create(auction);
        return this.mapToEntity(newAuction)
    }
    async findAll(): Promise<Auction[]> {
        const auctions=await AuctionModel.find();
        return auctions.map(this.mapToEntity)
    }
    async findBySellerId(sellerId: string): Promise<Auction[]> {
        const auctions=await AuctionModel.find({sellerId});
        return auctions.map(this.mapToEntity);
    }
    async findById(id: string): Promise<Auction|null> {
        const auction=await AuctionModel.findById(id);
        return auction? this.mapToEntity(auction):null
    }


    private mapToEntity(doc:any):Auction{
        return new Auction(
            doc.title,
            doc.description,
            doc.category,
            doc.startingPrice,
            doc.currentPrice,
            doc.endDate,
            doc.sellerId,
            doc.images,
            doc.status,
            doc._id.toString()
        );
    }
}