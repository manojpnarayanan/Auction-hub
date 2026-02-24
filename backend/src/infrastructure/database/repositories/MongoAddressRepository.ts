import { injectable } from "inversify";
import { IAddressRepository } from "../../../domain/interfaces/IAddressRepository";
import { Address } from "../../../domain/entities/Address.entity";
import { AddressModel } from "../models/AddressModel";
import { AddressPersistanceMapper } from "../Mappers/AddressPersistanceMapper";
import { NotFoundError } from "../../../domain/errors/errors";
import { CreateAddressDTO, updateAddressDTO } from "../../../application/dtos/AddressDTO";


@injectable()
export class MongoAddressRepository implements IAddressRepository{

    async findByUserId(userId: string): Promise<Address[]> {
        const doc=await AddressModel.find({userId}).sort({isDefault:-1,createdAt:-1});
        return doc.map(AddressPersistanceMapper.toEntity);

    }
    async findById(Id: string): Promise<Address | null> {
        const doc=await AddressModel.findById(Id);
        return doc? AddressPersistanceMapper.toEntity(doc):null;
    }
    async create(userId: string, data: CreateAddressDTO): Promise<Address> {
        const count=await AddressModel.countDocuments({userId});
        const doc=await AddressModel.create({
            userId,
            ...data,
            isDefault:count===0
        });
        return AddressPersistanceMapper.toEntity(doc);
    }
    async update(id: string, data: updateAddressDTO): Promise<Address> {
        const doc=await AddressModel.findByIdAndUpdate(id,data,{new:true});
        if(!doc) throw new Error("Address not found");
        return AddressPersistanceMapper.toEntity(doc);
    }
    async delete(id: string): Promise<void> {
        const doc=await AddressModel.findByIdAndDelete(id);
    }
    async setDeafult(userId: string, addressId: string): Promise<void> {
        await AddressModel.updateMany({userId},{isDefault:false});
        await AddressModel.findByIdAndUpdate(addressId,{isDefault:true});
    }
}