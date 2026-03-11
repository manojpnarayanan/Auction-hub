import { injectable ,inject } from "inversify";
import { IUpdateAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IUpdateAuctionUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import {TYPES} from "../../../di/types";
import { UpdateAuctionDTO } from "../../dtos/AuctionDTO";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";

@injectable()

export class UpdateAuctionUseCase implements IUpdateAuctionUseCase{
    constructor(
        @inject (TYPES.AuctionRepository)private _auctionRepository:IAuctionRepository,
    ) { }
    async execute(auctionId:string, item:UpdateAuctionDTO):Promise<AuctionResponseDTO | null>{
    const updateData:Record<string ,unknown>={...item};
    if(item.endDate){
        updateData.endDate=new Date(item.endDate);
    }
    
        const updatedAuction= await this._auctionRepository.update(auctionId,updateData);
        return updatedAuction ? AuctionDTOMapper.toResponseDTO(updatedAuction) :null;
    }
}