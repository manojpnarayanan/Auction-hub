

export interface IAddToWatchlistUseCase{
    execute(userId:string,auctionId:string):Promise<void>;
}