

export interface IRemoveFromWatchlistUseCase{
    execute(userId:string,auctionId:string):Promise<void>
}