export interface IGetAuctionBidsUseCase{
    execute(auctionid:string):Promise<any[]>
};