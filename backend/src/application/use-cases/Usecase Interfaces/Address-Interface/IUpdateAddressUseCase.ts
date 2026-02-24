import { AddressResponseDTO, updateAddressDTO } from "../../../dtos/AddressDTO";


export interface IUpdateAddressUseCase{
    execute(addressId:string,data:updateAddressDTO):Promise<AddressResponseDTO>
}