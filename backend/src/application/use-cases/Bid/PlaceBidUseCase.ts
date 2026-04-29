import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { PlaceBidDTO, BidResponseDTO } from "../../dtos/BidDTO";
import { Bid } from "../../../domain/entities/Bid.entity";
import { IPlaceBidUseCase } from "../Usecase Interfaces/Bid-interface/IPlaceBidUseCase";
import { ISocketService } from "../../../domain/interfaces/ISocketService";
import { BidDTOMapper } from "../../DTOMapper/BidDTOMapper";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IEventEmitter } from "../../../domain/interfaces/IEventEmitter";
import { BidPlacedEvent } from "../../../domain/events/AuctionEvents";
import logger from "../../../infrastructure/Global/Logger";
import { ICacheService } from "../../../domain/interfaces/ICacheService";



@injectable()

export class PlaceBidUseCase implements IPlaceBidUseCase {
    constructor(
        @inject(TYPES.BidRepository) private _bidRepository: IBidRepository,
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.SocketService) private _socketService: ISocketService,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.EventEmitter) private _eventEmitter:IEventEmitter,
        @inject (TYPES.CacheService) private _cacheService:ICacheService
    ) { }
    async execute(data: PlaceBidDTO): Promise<BidResponseDTO | null> {

        const redisKey=`auction:${data.auctionId}:price`;
        const cachedPrice=await this._cacheService.getNumber(redisKey);
        if(cachedPrice !==null && data.amount <=cachedPrice){
            throw new Error("Bid is too low >Please a higher amount");
        }

        const auction = await this._auctionRepository.findById(data.auctionId);

        if (!auction) throw new Error("Auction not found");
        auction.placeBid(data.bidderId, data.amount)

        const newBid = new Bid(data.auctionId, data.bidderId, data.amount, new Date());
        const savedBid = await this._bidRepository.create(newBid);

        await this._auctionRepository.addBid(auction.id!, {
            bidderId: data.bidderId,
            amount: data.amount,
            time: newBid.time
        });
        await this._cacheService.set(redisKey,data.amount.toString());
        
        let bidderName = 'Anonymous';
        try {
            const user = await this._userRepository.findById(data.bidderId);
            bidderName = user?.name || 'Anonymous';
        } catch (e) {
            logger.error(e,'[PlaceBid] User lookup failed:');
        }

        this._eventEmitter.dispatch(new BidPlacedEvent(
            data.auctionId,
            data.bidderId,
            data.amount,
            bidderName,
            newBid.time
        ));

        return BidDTOMapper.BidtoResponse(savedBid);
    }
}