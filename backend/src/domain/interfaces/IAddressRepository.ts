import { Address } from "../entities/Address.entity";
import { CreateAddressDTO,updateAddressDTO } from "../../application/dtos/AddressDTO";



export interface IAddressRepository{
    findByUserId(userId:string):Promise<Address[]>;
    findById(Id:string):Promise<Address|null>;
    create(userId:string,data:CreateAddressDTO):Promise<Address>;
    update(id:string,data:updateAddressDTO):Promise<Address>;
    delete(id:string):Promise<void>;
    setDeafult(userId:string,addressId:string):Promise<void>;
}