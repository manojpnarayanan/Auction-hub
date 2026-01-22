import { injectable } from "inversify";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionModel } from "../models/AuctionModel";
import { AuctionPersistanceMapper } from "../Mappers/AuctionPersistanceMapper";

@injectable()

export class MongoAuctionRepository implements IAuctionRepository{
    async create(auction:Auction):Promise<Auction>{
        const newAuction=await AuctionModel.create(auction);
        return AuctionPersistanceMapper.toEntity(newAuction)
    }
    async findAll(): Promise<Auction[]> {
        const auctions=await AuctionModel.find();
        return auctions.map(AuctionPersistanceMapper.toEntity)
    }
    async findBySellerId(sellerId: string): Promise<Auction[]> {
        const auctions=await AuctionModel.find({sellerId});
        return auctions.map(AuctionPersistanceMapper.toEntity);
    }
    async findById(id: string): Promise<Auction|null> {
        const auction=await AuctionModel.findById(id);
        return auction? AuctionPersistanceMapper.toEntity(auction):null
    }
    async update(id:string,data:Partial<Auction>):Promise<Auction | null>{
        const updatedAuction=await AuctionModel.findByIdAndUpdate(id,data,{new:true})
        if(!updatedAuction) return null;
        return AuctionPersistanceMapper.toEntity(updatedAuction); 
        // new Auction(
        //     updatedAuction.title,
        // updatedAuction.description,
        // updatedAuction.category,
        // updatedAuction.startingPrice,
        // updatedAuction.currentPrice,
        // updatedAuction.endDate,
        // updatedAuction.sellerId.toString(),
        // updatedAuction.images,
        // updatedAuction.status as "active" | "sold" | "expired",
        // // updatedAuction._id.toString();
        // )
    }
    async findByCategory(category:string):Promise<Auction[]>{
        const auctions=await AuctionModel.find({category:category});
        return auctions.map(AuctionPersistanceMapper.toEntity);
    }


    // private mapToEntity(doc:any):Auction{
    //     return new Auction(
    //         doc.title,
    //         doc.description,
    //         doc.category,
    //         doc.startingPrice,
    //         doc.currentPrice,
    //         doc.endDate,
    //         doc.sellerId,
    //         doc.images,
    //         doc.status,
    //         doc._id.toString()
    //     );
    // }
}