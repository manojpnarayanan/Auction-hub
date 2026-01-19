import { Auction } from "../entities/Auction.entity";


export interface IAuctionRepository{
    create(auction:Auction):Promise<Auction>;
    findAll():Promise<Auction[]>;
    findBySellerId(sellerId:string):Promise<Auction[]>;
    findById(id:string):Promise<Auction | null>;
    update(id:string,data:Partial<Auction>):Promise< Auction | null>;
    findByCategory(category:string):Promise<Auction[]>;
}