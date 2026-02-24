import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAddAddressUseCase } from "../../Usecase Interfaces/Address-Interface/IAddAddressUseCase";
import { AddressResponseDTO,CreateAddressDTO } from "../../../dtos/AddressDTO";
import { AddressDTOMapper } from "../../../DTOMapper/AddressDTOMapper";
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";



@injectable()
export class AddAddressUseCase implements IAddAddressUseCase{
    constructor(
        @inject(TYPES.AddressRepository)private addressRepository:IAddressRepository
    ){}
    async execute(userId: string, data: CreateAddressDTO): Promise<AddressResponseDTO> {
        const addresses=await this.addressRepository.create(userId,data);
        return AddressDTOMapper.toResponseDTO(addresses);
    }
}