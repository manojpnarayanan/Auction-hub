import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { IGetAuctionBidsUseCase } from "../Usecase Interfaces/Bid-interface/IGetAuctionBidsUseCase";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { AuctionBidResponseDTO } from "../../dtos/BidDTO";


@injectable()

export class GetAuctionBidsUseCase implements IGetAuctionBidsUseCase{
    constructor(
        @inject(TYPES.BidRepository) private bidRepository:IBidRepository,
        @inject(TYPES.UserRepository) private userRepository:IUserRepository
    ) { }

    async execute(auctionId: string): Promise<AuctionBidResponseDTO[]> {
        const bids=await this.bidRepository.findByAuctionId(auctionId);
        const bidsWithUser=await Promise.all(bids.map(async (bid)=>{
            const user=await this.userRepository.findById(bid.bidderId);
            return {
                id:bid.id!,
                amount:bid.amount,
                time:bid.time,
                bidderName:user?user.name:"unknown",
                bidderImage:"https://via.placeholder.com/32",
            };
        }));
        return bidsWithUser
    }
}