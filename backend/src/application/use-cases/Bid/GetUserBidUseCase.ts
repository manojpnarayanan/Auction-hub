import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { IGetUserBidsUseCase } from "../Usecase Interfaces/Bid-interface/IGetUserBidsUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { UserBidResponseDTO, AuctionSummaryDTO, BidStatusType } from "../../dtos/BidDTO";

import { BidDTOMapper } from "../../DTOMapper/BidDTOMapper";

@injectable()

export class GetUserBidUseCase implements IGetUserBidsUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository: IAuctionRepository,
        @inject(TYPES.BidRepository) private bidRepository: IBidRepository,

    ) { };
    async execute(userId: string): Promise<UserBidResponseDTO[]> {
        const userBids = await this.bidRepository.findByBidderId(userId);

        if (userBids.length === 0) return [];

        const auctionIds = [...new Set(userBids.map(bid => bid.auctionId))];
        
        const auctions = await Promise.all(
            auctionIds.map(id => this.auctionRepository.findById(id))
        );
        const response: UserBidResponseDTO[] = auctions.filter(auction => auction !== null)
            .map(auction => {
                const myBidsforAuction = userBids.filter(bid => bid.auctionId === auction!.id)
                const myHighestBid = Math.max(...myBidsforAuction.map(bid => bid.amount));
                const isHighestBidder = auction!.currentPrice === myHighestBid;
                // const status=this.calculateStatus(isHighestBidder,auction!.status);
                const lastBidTime = myBidsforAuction.reduce((latest, bid) => bid.time > latest ? bid.time : latest, myBidsforAuction[0].time);
                let status: BidStatusType;
                if (auction!.status === 'active') {
                    status = isHighestBidder ? 'winning' : 'outbid';
                } else if (auction!.status === 'sold' || auction!.status === 'expired') {
                    status = isHighestBidder ? "won" : "lost"
                } else {
                    status = 'lost'
                };
                return {
                    auction: BidDTOMapper.toAuctionSummaryDTO(auction!),
                    myHighestBid,
                    isHighestBidder,
                    status,
                    lastBidTime
                };
            });
        return response.sort((a, b) => b.lastBidTime.getTime() - a.lastBidTime.getTime());
    }
}