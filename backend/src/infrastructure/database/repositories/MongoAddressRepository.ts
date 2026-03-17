import { injectable } from "inversify";
import { IAddressRepository } from "../../../domain/interfaces/IAddressRepository";
import { Address } from "../../../domain/entities/Address.entity";
import { AddressModel, IAddressDocument } from "../models/AddressModel";
import { AddressPersistanceMapper } from "../Mappers/AddressPersistanceMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class MongoAddressRepository extends BaseRepository<Address, IAddressDocument> implements IAddressRepository {

    constructor() { super(AddressModel, AddressPersistanceMapper.toEntity) }
    async findByUserId(userId: string): Promise<Address[]> {
        const doc = await AddressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        return doc.map(AddressPersistanceMapper.toEntity);

    }
    // async findById(Id: string): Promise<Address | null> {
    //     const doc=await AddressModel.findById(Id);
    //     return doc? AddressPersistanceMapper.toEntity(doc):null;
    // }
    async create(address:Address): Promise<Address> {
        const count = await AddressModel.countDocuments({ userId:address.userId });
        const doc = await AddressModel.create({
            ...address,
            isDefault: count === 0
        });
        return AddressPersistanceMapper.toEntity(doc);
    }
    // async update(id: string, data: updateAddressDTO): Promise<Address> {
    //     const doc=await AddressModel.findByIdAndUpdate(id,data,{new:true});
    //     if(!doc) throw new Error("Address not found");
    //     return AddressPersistanceMapper.toEntity(doc);
    // }
    // async delete(id: string): Promise<void> {
    //     const doc=await AddressModel.findByIdAndDelete(id);
    // }
    async setDeafult(userId: string, addressId: string): Promise<void> {
        await AddressModel.updateMany({ userId }, { isDefault: false });
        await AddressModel.findByIdAndUpdate(addressId, { isDefault: true });
    }
}