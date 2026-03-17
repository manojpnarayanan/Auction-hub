

export interface IAdminAuctionManagamentUseCase{
    execute(auctionId:string,status:string,reason?:string):Promise<void>
}