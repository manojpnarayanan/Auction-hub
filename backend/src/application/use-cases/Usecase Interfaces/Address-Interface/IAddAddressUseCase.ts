import { CreateAddressDTO,AddressResponseDTO } from "../../../dtos/AddressDTO";


export interface IAddAddressUseCase{
    execute(userId:string,data:CreateAddressDTO):Promise<AddressResponseDTO>;
}