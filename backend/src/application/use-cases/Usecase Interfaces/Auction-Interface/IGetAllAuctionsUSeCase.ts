import { AuctionResponseDTO } from "../../../dtos/AuctionDTO";


export interface IGetAllAuctionUseCase{
    execute(
        category?:string,
        search?:string, 
        type?:string,
        status?:string,
        page?:number,
        limit?:number
    ):Promise<{data:AuctionResponseDTO[],total:number,page:number,totalPages:number}>
}