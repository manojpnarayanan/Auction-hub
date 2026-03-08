import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IWatchlistRepository } from "../../../../domain/interfaces/IWatchlistRepository";
import { IRemoveFromWatchlistUseCase } from "../../Usecase Interfaces/Watchlist-Interface/IRemoveFromWatchlistUseCase";

@injectable()
export class RemoveFromWatchlistUseCase implements IRemoveFromWatchlistUseCase{
    constructor(
        @inject(TYPES.WatchlistRepository) private _watchlistRepository:IWatchlistRepository
    ){}
    async execute(userId: string, auctionId: string): Promise<void> {
        await this._watchlistRepository.removeFromWatchlist(userId,auctionId);
    }
}