import { Category } from "../../../../../domain/entities/Category.entity";
import { CategoryRequestDTO } from "../../../../dtos/CategoryDTO";
import { CategoryDTO } from "../../../../dtos/CategoryDTO";

export interface ICreatecategoryUseCase{
    execute(data:CategoryRequestDTO):Promise<CategoryDTO>
}