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
    async findByBidderId(bidderId: string,page:number,limit:number): Promise<{bids:Bid[],total:number}> {
        const skip=(page-1)*limit;
        const totalResult=await BidModel.aggregate([
            {$match:{bidderId}},
            {$group:{_id:'$auctionId'}},
            {$count:'count'}
        ]);
        const total=totalResult[0]?.count;
        const paginatedAuctions=await BidModel.aggregate([
            {$match:{bidderId}},
            {$sort:{amount:-1}},
            {$group:{
                _id:'$auctionId',highestBid:{$first:'$$ROOT'},
                latestTime:{$max:"$time"}
            }},
            {$sort:{latestTime:-1}},
            {$skip:skip},
            {$limit:limit}
        ]);
        // const docs=await BidModel.find({bidderId}).sort({time:-1}).skip(skip).limit(limit);
        // return {bids:docs.map(d=>new Bid(d.auctionId,d.bidderId,d.amount,d.time,d.id.toString())),total};
       const bids=paginatedAuctions.map(p=>{
        const d=p.highestBid;
        return new Bid(d.auctionId,d.bidderId,d.amount,d.time,d._id.toString());
       });
        return {bids,total}
       }
}