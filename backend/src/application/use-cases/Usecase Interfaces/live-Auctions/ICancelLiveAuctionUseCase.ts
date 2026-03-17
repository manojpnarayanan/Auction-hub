

export interface ICancelLiveAuctionUseCase{
    execute(auctionId:string,requestId:string,isAdmin:boolean,reason?:string):Promise<void>
}