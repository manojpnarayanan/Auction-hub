import { injectable, inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { Address } from "../../../../domain/entities/Address.entity";
import { IAddAddressUseCase } from "../../Usecase Interfaces/Address-Interface/IAddAddressUseCase";
import { AddressResponseDTO, CreateAddressDTO } from "../../../dtos/AddressDTO";
import { AddressDTOMapper } from "../../../DTOMapper/AddressDTOMapper";
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";



@injectable()
export class AddAddressUseCase implements IAddAddressUseCase {
    constructor(
        @inject(TYPES.AddressRepository) private _addressRepository: IAddressRepository
    ) { }
    async execute(userId: string, data: CreateAddressDTO): Promise<AddressResponseDTO> {
        const newAddresses = new Address(
            "",
            userId,
            data.label,
            data.label,
            data.city,
            data.state,
            data.pincode,
            false,
            new Date(),
            new Date()
        )
        const savedAddress=await this._addressRepository.create(newAddresses);
        return AddressDTOMapper.toResponseDTO(savedAddress);
    }
}