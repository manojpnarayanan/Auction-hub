

export interface ICancelLiveAuctionUseCase{
    execute(auctionId:string,requestId:string,isAdmin:boolean):Promise<void>
}