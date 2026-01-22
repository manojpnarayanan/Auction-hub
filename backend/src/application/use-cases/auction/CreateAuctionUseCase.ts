import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { ICreateAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { Auction } from "../../../domain/entities/Auction.entity";
import { CreateAuctionDTO } from "../../dtos/AuctionDTO";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";



@injectable()

export class CreateAuctionUseCase implements ICreateAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ) { }
    async execute(data:CreateAuctionDTO):Promise<AuctionResponseDTO>{
        const newAuction=new Auction(
            data.title,
            data.description,
            data.category,
            data.startingPrice,
            data.currentPrice,
            new Date(data.endDate),
            data.sellerId,
            data.images || []
        );
        const createdAuction= await this.auctionRepository.create(newAuction);
        return AuctionDTOMapper.toResponseDTO(createdAuction);
    
    
    }
}