 
import { Category } from "../../../domain/entities/Category.entity";

export class CategoryPersistanceMapper{
    static toEntity(doc:any):Category{
        return new Category (
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt,
        )
    }
}