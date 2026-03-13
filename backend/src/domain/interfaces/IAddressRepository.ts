import { Address } from "../entities/Address.entity";
import {  updateAddressDTO } from "../../application/dtos/AddressDTO";



export interface IAddressRepository {
    findByUserId(userId: string): Promise<Address[]>;
    findById(Id: string): Promise<Address | null>;
    create(address:Address): Promise<Address>;
    update(id: string, data: updateAddressDTO): Promise<Address | null>;
    delete(id: string): Promise<boolean>;
    setDeafult(userId: string, addressId: string): Promise<void>;
}