import { injectable,inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { IAddressRepository } from "../../../../domain/interfaces/IAddressRepository";
import { ISetDefaultUseCase } from "../../Usecase Interfaces/Address-Interface/ISetDefaultUseCase";


@injectable()
export class SetDefaultAddressUseCase implements ISetDefaultUseCase{
    constructor(
        @inject(TYPES.AddressRepository) private _addressRepository:IAddressRepository
    ){}
    async execute(userId: string, addressId: string): Promise<void> {
        await this._addressRepository.setDeafult(userId,addressId);
    }
}