import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IGetAuctionDetailsUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";


@injectable()

export class GetAuctionDetailsUSeCase implements IGetAuctionDetailsUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ) { };
    async execute(id: string): Promise<AuctionResponseDTO | null> {
        const auction=await  this.auctionRepository.findById(id);

        if(!auction) return null;

        if(auction.status === 'active' && auction.type=== 'timed' && new Date() > new Date(auction.endDate)){
            const hasBids=auction.bids && auction.bids.length>0;
            if (hasBids){
                const winner=auction.bids[0];
                auction.status='sold',
                auction.winnerId=winner.bidderId,
                auction.currentPrice=winner.amount
            }else{
                auction.status='expired'
            }
            await this.auctionRepository.update(auction.id!,{
                status:auction.status,
                winnerId:auction.winnerId,
                currentPrice:auction.currentPrice
            })
        }
        return AuctionDTOMapper.toResponseDTO(auction)
    }
}