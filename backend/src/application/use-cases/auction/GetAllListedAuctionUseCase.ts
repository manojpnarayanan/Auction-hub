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
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository
    ) { };
    async execute(sellerId:string,page:number,limit:number):Promise<{data:AuctionResponseDTO[],total:number,totalPages:number}>{
        const {auctions,total}= await this._auctionRepository.findBySellerId(sellerId,page,limit);
        return {data:AuctionDTOMapper.toResponseDTOs(auctions),total,totalPages:Math.ceil(total/limit)};
    }
}