import { injectable } from "inversify";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { Bid } from "../../../domain/entities/Bid.entity";
import { BidModel } from "../models/BidModel";


@injectable()

export class MongoBidRepository implements IBidRepository{
    async create(bid:Bid):Promise<Bid>{
        const newBid=new BidModel({
            auctionId:bid.auctionId,
            bidderId:bid.bidderId,
            amount:bid.amount,
            time:bid.time
        })
        const saved=await newBid.save();
        return new Bid(saved.auctionId,saved.bidderId,saved.amount,saved.time,saved.id.toString());
    }
    async findByAuctionId(auctionId: string): Promise<Bid[]> {
        const docs=await BidModel.find({auctionId}).sort({amount:-1});
        return docs.map(d=>new Bid(d.auctionId,d.bidderId,d.amount,d.time,d.id.toString()));
    }
    async findByBidderId(bidderId: string): Promise<Bid[]> {
        const docs=await BidModel.find({bidderId}).sort({time:-1});
        return docs.map(d=>new Bid(d.auctionId,d.bidderId,d.amount,d.time,d.id.toString()));
        }
}