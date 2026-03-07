import { Auction } from "../entities/Auction.entity";


export interface IAuctionRepository {
    create(auction: Auction): Promise<Auction>;
    findAll(filters?: { 
        category?: string, 
        search?: string, 
        type?: string, 
        status?: string,
        page?:number,
        limit?:number, 
    }): Promise<{auction:Auction[],total:number}>;
    findBySellerId(sellerId: string): Promise<Auction[]>;
    findById(id: string): Promise<Auction | null>;
    update(id: string, data: Partial<Auction>): Promise<Auction | null>;
    findByCategory(category: string): Promise<Auction[]>;
    addBid(auctionId: string, bid: { bidderId: string, amount: number, time: Date }): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findExpiredActiveAuctions(): Promise<Auction[]>;
    updateAuctionStatus(id: string, status: string, winnerId?: string): Promise<void>;
    updatePaymentStatus(id:string,status:string):Promise<void>;
    findAuctionstoStart():Promise<Auction[]>;
}