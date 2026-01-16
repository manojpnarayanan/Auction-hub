

export interface CreateAuctionDTO{
    title:string,
    description:string,
    category:string,
    startingPrice:number,
    currentPrice:number,
    endDate:Date| string,
    sellerId:string,
    images?:string[]
}