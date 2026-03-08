import { injectable,inject } from "inversify";
import {TYPES} from "../../../../di/types";
import { IGetWatchlistUseCase } from "../../Usecase Interfaces/Watchlist-Interface/IGetWatchlistUseCase";
import { IWatchlistRepository } from "../../../../domain/interfaces/IWatchlistRepository";
import { WatchlistDTO } from "../../../dtos/WatchlistDTO";
import { IAuctionRepository } from "../../../../domain/interfaces/IAuctionRepository";
import { WatchlistDTOMapper } from "../../../DTOMapper/WatchlistDTOMapper";

@injectable()
export class GetWatchlistUseCase implements IGetWatchlistUseCase{
    constructor(
        @inject(TYPES.WatchlistRepository)private _watchlistRepository:IWatchlistRepository,
        @inject(TYPES.AuctionRepository)private _auctionRepository:IAuctionRepository
    ){}
    async execute(userId: string): Promise<WatchlistDTO[]> {
        const auctionIds=await this._watchlistRepository.getWatchlist(userId);
        const results=await Promise.all(auctionIds.map(id=>this._auctionRepository.findById(id)));
        return results.filter((a)=>a !== null)
        .map(WatchlistDTOMapper.toDTO)
    }
}