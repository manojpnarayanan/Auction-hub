

export interface ICheckWatchlistUseCase{
    execute(userId:string,auctionId:string):Promise<boolean>
}