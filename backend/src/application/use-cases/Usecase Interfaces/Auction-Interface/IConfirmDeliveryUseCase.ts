

export interface IConfirmDeliveryUseCase{
    execute(auctionid:string,buyerId:string):Promise<void>
}