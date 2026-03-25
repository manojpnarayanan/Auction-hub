import { DisputeResponseDTO } from "../../../dtos/DisputeDTO";



export interface IGetDisputeUseCase{
    getBuyerDisputes(buyerId:string,page:number,limit:number):Promise<{disputes:DisputeResponseDTO[];total:number}>;
    getAllDisputes(page:number,limit:number,status?:string):Promise<{disputes:DisputeResponseDTO[];total:number}>;
}