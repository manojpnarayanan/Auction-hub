import { injectable ,inject } from "inversify";
import { IUpdateAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IUpdateAuctionUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import {TYPES} from "../../../di/types";
import { UpdateAuctionDTO } from "../../dtos/AuctionDTO";
import { Auction } from "../../../domain/entities/Auction.entity";

@injectable()

export class UpdateAuctionUseCase implements IUpdateAuctionUseCase{
    constructor(
        @inject (TYPES.AuctionRepository)private auctionRepository:IAuctionRepository,
    ) { }
    async execute(auctionId:string, item:UpdateAuctionDTO):Promise<Auction | null>{
    const updateData:any={...item};
    if(item.endDate){
        updateData.endDate=new Date(item.endDate);
    }
    
        return await this.auctionRepository.update(auctionId,updateData);
    }
}