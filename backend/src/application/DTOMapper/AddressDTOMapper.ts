import { Address } from "../../domain/entities/Address.entity";
import { AddressResponseDTO } from "../dtos/AddressDTO";


export class AddressDTOMapper{
    static toResponseDTO(address:Address):AddressResponseDTO{
        return {
            id:address.id,
            userId:address.userId,
            label:address.label,
            street:address.street,
            city:address.city,
            state:address.state,
            pincode:address.pincode,
            isDefault:address.isDefault,
            createdAt:address.createdAt
        }
    }
}