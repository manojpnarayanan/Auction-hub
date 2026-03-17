import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IGetAuctionDetailsUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";



@injectable()

export class GetAuctionDetailsUSeCase implements IGetAuctionDetailsUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository,
        @inject(TYPES.UserRepository) private _userRepository:IUserRepository
    ) { };
    async execute(id: string): Promise<AuctionResponseDTO | null> {
        const auction=await  this._auctionRepository.findById(id);

        if(!auction) return null;

        if(auction.status === 'active' && auction.type === 'timed' && new Date() > new Date(auction.endDate)){
            const hasBids=auction.bids && auction.bids.length>0;
            if (hasBids){
                const winner = auction.bids[0];
                auction.status = 'sold';
                auction.winnerId = winner.bidderId;
                auction.currentPrice= winner.amount;
            }else{
                auction.status= 'expired'
            }
            await this._auctionRepository.update(auction.id!,{
                status:auction.status,
                winnerId:auction.winnerId,
                currentPrice:auction.currentPrice
            })
        }
        const enrichedBids=await Promise.all((auction.bids || []).map(async (bid)=>{
            const bidder=await this._userRepository.findById(bid.bidderId);
            return {
                ...bid,
                bidderName:bidder?.name ||"Anonymous" 
            }
        }));
        auction.bids=enrichedBids;
        return AuctionDTOMapper.toResponseDTO(auction)
    }
}