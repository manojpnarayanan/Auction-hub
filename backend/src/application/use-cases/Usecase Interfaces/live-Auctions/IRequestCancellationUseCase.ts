

export interface IRequestCancellationUseCase{
    execute(auctionId:string,sellerId:string,reason:string):Promise<void>
}