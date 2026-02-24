import { AddressResponseDTO } from "../../../dtos/AddressDTO";;



export interface IGetAddressUseCase{
    execute(userId:string):Promise<AddressResponseDTO[]>
}