

export interface IAdminAuctionManagamentUseCase{
    execute(auctionId:string,status:string):Promise<void>
}