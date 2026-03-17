import { injectable,inject } from "inversify";
import {TYPES} from '../../../../di/types';
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";
import { AddressResponseDTO } from "../../../dtos/AddressDTO";
import { AddressDTOMapper } from "../../../DTOMapper/AddressDTOMapper";
import { IGetAddressUseCase } from "../../Usecase Interfaces/Address-Interface/IGetAddressUseCase";



@injectable()
export class GetAddressUseCase implements IGetAddressUseCase{
    constructor(
        @inject(TYPES.AddressRepository)private _addressRepository:IAddressRepository
    ){}
    async execute(userId: string): Promise<AddressResponseDTO[]> {
        const addresses=await this._addressRepository.findByUserId(userId);
        return addresses.map(AddressDTOMapper.toResponseDTO)
    }
}