import { Bid } from "../entities/Bid.entity";


export interface IBidRepository{
    create(bid:Bid):Promise<Bid>;
    findByAuctionId(auctionId:string):Promise<Bid[]>
    findByBidderId(bidderId:string):Promise<Bid[]>;
}