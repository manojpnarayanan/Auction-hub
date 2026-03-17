import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";
import { IDeleteAddressUseCase } from "../../Usecase Interfaces/Address-Interface/IDeleteAddressUseCase";



@injectable()
export class DeleteAddressUseCase implements IDeleteAddressUseCase{
    constructor(
        @inject (TYPES.AddressRepository) private _addressRepository:IAddressRepository
    ){}
    async execute(addressId: string): Promise<void> {
        await this._addressRepository.delete(addressId);
    }
}