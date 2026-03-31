import { Dispute } from "../entities/Dispute.entity";



export interface IDisputeRepository{
    create(dispute:Dispute):Promise<Dispute>;
    findById(id:string):Promise<Dispute | null>;
    findByAuctionId(auctionId:string):Promise<Dispute | null>;
    findByBuyerId(buyerId:string,page:number,limit:number):Promise<{dispute:Dispute[];total:number}>;
    findAll(page:number,limit:number,status?:string):Promise<{disputes:Dispute[];total:number}>;
    updateStatus(id:string,status:string,adminnote?:string):Promise<void>
}