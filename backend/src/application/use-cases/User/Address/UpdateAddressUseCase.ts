import { injectable, inject } from "inversify";
import { TYPES } from '../../../../di/types';
import { IUpdateAddressUseCase } from "../../Usecase Interfaces/Address-Interface/IUpdateAddressUseCase";
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";
import { AddressResponseDTO, updateAddressDTO } from "../../../dtos/AddressDTO";
import { AddressDTOMapper } from "../../../DTOMapper/AddressDTOMapper";
import { NotFoundError } from "../../../../domain/errors/errors";




@injectable()
export class UpdateAddressUseCase implements IUpdateAddressUseCase {
    constructor(
        @inject(TYPES.AddressRepository) private _addressRepository: IAddressRepository
    ) { }
    async execute(addressId: string, data: updateAddressDTO): Promise<AddressResponseDTO> {
        const addresses = await this._addressRepository.update(addressId, data);
        if(!addresses)throw new NotFoundError("Address not found");
        return AddressDTOMapper.toResponseDTO(addresses);
    }
}