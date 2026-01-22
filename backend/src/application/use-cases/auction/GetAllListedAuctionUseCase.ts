import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { CreateAuctionDTO } from "../../dtos/AuctionDTO";
import { IGetAllListedAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAllListedAuctionUseCase";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";


@injectable()

export class GetAllListedAuctionUseCase implements IGetAllListedAuctionUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ) { };
    async execute(sellerId:string):Promise<AuctionResponseDTO[]>{
        const auctions= await this.auctionRepository.findBySellerId(sellerId);
        return AuctionDTOMapper.toResponseDTOs(auctions);
    }
}