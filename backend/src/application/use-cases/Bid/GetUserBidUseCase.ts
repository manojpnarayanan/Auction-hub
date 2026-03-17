import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IBidRepository } from "../../../domain/interfaces/IBidRepository";
import { IGetUserBidsUseCase } from "../Usecase Interfaces/Bid-interface/IGetUserBidsUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { UserBidResponseDTO, BidStatusType } from "../../dtos/BidDTO";

import { BidDTOMapper } from "../../DTOMapper/BidDTOMapper";

@injectable()

export class GetUserBidUseCase implements IGetUserBidsUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.BidRepository) private _bidRepository: IBidRepository,

    ) { };
    async execute(userId: string,page:number,limit:number): Promise<{data:UserBidResponseDTO[],total:number}> {
        const {bids,total} = await this._bidRepository.findByBidderId(userId,page,limit);

        if (bids.length === 0) return {data:[],total:0};

        const auctionIds = [...new Set(bids.map(bid => bid.auctionId))];
        
        const auctions = await Promise.all(
            auctionIds.map(id => this._auctionRepository.findById(id))
        );
        const data: UserBidResponseDTO[] = auctions.filter(auction => auction !== null)
            .map(auction => {
                const myBidsforAuction = bids.filter(bid => bid.auctionId === auction!.id)
                // const myHighestBid = Math.max(...myBidsforAuction.map(bid => bid.amount));
                const myHighestBid = myBidsforAuction[0].amount;
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
        return {data:data.sort((a, b) => b.lastBidTime.getTime() - a.lastBidTime.getTime()),total};
    }
}