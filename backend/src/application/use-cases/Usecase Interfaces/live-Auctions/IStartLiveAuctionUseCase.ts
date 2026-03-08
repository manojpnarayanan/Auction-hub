

export interface IStartLiveAuctionUseCase{
    execute(auctionId:string,hostId:string):Promise<void>
}