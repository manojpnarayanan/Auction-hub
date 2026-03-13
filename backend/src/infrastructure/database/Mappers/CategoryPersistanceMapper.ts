import { ICategoryDocument } from "../models/CategoryModel"; 
import { Category } from "../../../domain/entities/Category.entity";


export class CategoryPersistanceMapper{
    static toEntity(doc:ICategoryDocument):Category{
        return new Category (
            doc.id,
            doc.name,
            doc.description,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt,
        )
    }
}