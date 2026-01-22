import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { CreateAuctionDTO } from "../../dtos/AuctionDTO";
import { IGetAllAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAllAuctionsUSeCase";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";


@injectable()

export class GetAllAuctionsUseCase implements IGetAllAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository,

    ) { }
    async execute(category:string): Promise<AuctionResponseDTO[]> {
        let auctions;
        if(category && category!=="All"){
            auctions= await this.auctionRepository.findByCategory(category)
        }else {
            auctions= await this.auctionRepository.findAll();

        }
        return AuctionDTOMapper.toResponseDTOs(auctions);
    }
}