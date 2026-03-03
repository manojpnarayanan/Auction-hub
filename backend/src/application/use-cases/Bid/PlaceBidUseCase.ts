import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { PlaceBidDTO,BidResponseDTO } from "../../dtos/BidDTO";
import { Bid } from "../../../domain/entities/Bid.entity";
import { IPlaceBidUseCase } from "../Usecase Interfaces/Bid-interface/IPlaceBidUseCase";
import { ISocketService } from "../../../domain/interfaces/ISocketService";
import { BidDTOMapper } from "../../DTOMapper/BidDTOMapper";



@injectable()

export class PlaceBidUseCase implements IPlaceBidUseCase{
    constructor(
        @inject (TYPES.BidRepository) private bidRepository:IBidRepository,
        @inject (TYPES.AuctionRepository) private auctionRepository:IAuctionRepository,
        @inject (TYPES.SocketService) private socketService:ISocketService,
    ) { }
    async execute(data:PlaceBidDTO):Promise<BidResponseDTO | null>{
        const auction=await this.auctionRepository.findById(data.auctionId);
 
        if(!auction) throw new Error("Auction not found");
        auction.placeBid(data.bidderId,data.amount)

        const newBid=new Bid(data.auctionId,data.bidderId,data.amount,new Date());
        const savedBid=await this.bidRepository.create(newBid);

        await this.auctionRepository.addBid(auction.id!, {
            bidderId:data.bidderId,
            amount:data.amount,
            time:newBid.time
        });
        this.socketService.emit('bid_update',{
            auctionId:data.auctionId,
            newPrice:data.amount,
            bid:savedBid,
        },data.auctionId);
        return BidDTOMapper.BidtoResponse(savedBid);
    }
}