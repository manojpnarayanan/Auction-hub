import { Address } from "../../../domain/entities/Address.entity";
import { IAddressDocument } from "../models/AddressModel";


export class AddressPersistanceMapper{
    static toEntity(doc:IAddressDocument):Address{
        return new Address(
            doc._id.toString(),
            doc.userId.toString(),
            doc.label,
            doc.street,
            doc.city,
            doc.state,
            doc.pincode,
            doc.isDefault,
            doc.createdAt,
            doc.updatedAt,
    )
    }
}