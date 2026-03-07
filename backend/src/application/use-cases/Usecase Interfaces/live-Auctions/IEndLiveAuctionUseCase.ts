


export interface IEndLiveAuctionUseCase{
    execute(auctionId:string,hostId:string):Promise<void>
}