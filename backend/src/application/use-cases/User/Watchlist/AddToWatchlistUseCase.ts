import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWatchlistRepository } from "../../../../domain/interfaces/IWatchlistRepository";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { NotFoundError } from "../../../../domain/errors/errors";
import { IAddToWatchlistUseCase } from "../../Usecase Interfaces/Watchlist-Interface/IAddToWatchlistUseCase";



@injectable()
export class AddToWatchlistUseCase implements IAddToWatchlistUseCase{
    constructor(
        @inject(TYPES.WatchlistRepository)private _watchlistRepository:IWatchlistRepository,
        @inject(TYPES.AuctionRepository)private _auctionRepository:IAuctionRepository
    ){}
    async execute(userId: string, auctionId: string): Promise<void> {
        const auction=await this._auctionRepository.findById(auctionId);
        if(!auction) throw new NotFoundError("Auction not found");
        await this._watchlistRepository.addToWatchlist(userId,auctionId);
    }
}