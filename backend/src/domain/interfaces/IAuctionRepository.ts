import { Auction } from "../entities/Auction.entity";


export interface IAuctionRepository{
    create(auction:Auction):Promise<Auction>;
    findAll():Promise<Auction[]>;
    findBySellerId(sellerId:string):Promise<Auction[]>;
    findById(id:string):Promise<Auction | null>;
}