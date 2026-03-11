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
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,

    ) { }
    async execute(
        category?:string,
        search?:string,
        type?:string,
        status:string='active',
        page:number=1,
        limit:number=10
    ): Promise<{data:AuctionResponseDTO[],total:number,page:number,totalPages:number}> {
        const {auction,total}=await this._auctionRepository.findAll({category,search,type,status,page,limit})



        return {data:AuctionDTOMapper.toResponseDTOs(auction),total,page,totalPages:Math.ceil(total/limit)};
    }
}