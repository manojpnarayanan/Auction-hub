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


@injectable()

export class PlaceBidUseCase implements IPlaceBidUseCase {
    constructor(
        @inject(TYPES.BidRepository) private _bidRepository: IBidRepository,
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.SocketService) private _socketService: ISocketService,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    ) { }
    async execute(data: PlaceBidDTO): Promise<BidResponseDTO | null> {
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
        // const user=await this._userRepository.findById(data.bidderId);
        // this._socketService.emit('bid_update',{
        //     auctionId:data.auctionId,
        //     newPrice:data.amount,
        //     bid:savedBid,
        // },data.auctionId);
        let bidderName = 'Anonymous';
        try {
            const user = await this._userRepository.findById(data.bidderId);
            bidderName = user?.name || 'Anonymous';
        } catch (e) {
            logger.error('[PlaceBid] User lookup failed:', e);
        }

        this._socketService.emit('bid_update', {
            auctionId: data.auctionId,
            newPrice: data.amount,
            bid: {
                bidderId: data.bidderId,
                amount: data.amount,
                time: newBid.time,
                bidderName,
            },
        }, data.auctionId);

        return BidDTOMapper.BidtoResponse(savedBid);
    }
}