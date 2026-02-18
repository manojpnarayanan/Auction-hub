

export interface IDeleteAuctionUseCase{
    execute(id:string):Promise<boolean>
}