import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { CreateAuctionDTO } from "../../dtos/AuctionDTO";
import { IGetAllAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { Auction } from "../../../domain/entities/Auction.entity";


@injectable()

export class GetAllAuctionsUseCase implements IGetAllAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository,

    ) { }
    async execute(category:string): Promise<Auction[]> {
        if(category && category!=="All"){
            return await this.auctionRepository.findByCategory(category)
        }
        return await this.auctionRepository.findAll();
    }
}