import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWatchlistRepository } from "../../../../domain/interfaces/IWatchlistRepository";
import { ICheckWatchlistUseCase } from "../../Usecase Interfaces/Watchlist-Interface/ICheckWatchlistUseCase";


@injectable()
export class CheckWatchlistUseCase implements ICheckWatchlistUseCase{
    constructor(
        @inject(TYPES.WatchlistRepository) private _watchlistRepository:IWatchlistRepository
    ){}
    async execute(userId: string, auctionId: string): Promise<boolean> {
        return await this._watchlistRepository.isInWatchlist(userId,auctionId);
    }
}