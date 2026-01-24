import { Category } from "../../domain/entities/Category.entity";
import { CategoryDTO } from "../dtos/CategoryDTO";
import { IMapper } from "../Mapper Interface/IMapper";

export class CategoryDTOMapper implements IMapper <Category,CategoryDTO>{
     toDTO(category:Category):CategoryDTO {
        return {
            id:category.id,
            name:category.name,
            description:category.description,
            isActive:category.isActive,
            createdAt:category.createdAt,
        }
    }
}
export const categoryDTOMapper=new CategoryDTOMapper();