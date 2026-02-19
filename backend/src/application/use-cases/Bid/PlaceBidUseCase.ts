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
       console.log(auction)

        if(auction?.sellerId === data.bidderId) throw new Error("Auctioner should not bid in this auction")
        
        if(!auction) throw new Error("Auction not found");
        if(auction.status !== 'active') throw new Error("Auction is closed");
        if(auction.type==='timed' && new Date()>new Date(auction.endDate)){
            throw new Error("Auction has ended");
        }
        if(auction.type ==='live' && auction.startTime && new Date()<new Date(auction.startTime)) {
            throw new Error("Auction has not started yet");
        }
        // if(data.amount<auction.startingPrice){
            //     throw new Error(`Bid must be at least starting Price ${auction.startingPrice}`)
            // }
        const currentHighest=auction.currentPrice || auction.startingPrice;
        if(data.amount <= currentHighest){
                throw new Error(`Bid must be higher than current price ${currentHighest}`);
        } 

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