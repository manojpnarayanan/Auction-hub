import { WatchlistDTO } from "../../../dtos/WatchlistDTO";


export interface IGetWatchlistUseCase{
    execute(userId:string):Promise<WatchlistDTO[]>
}