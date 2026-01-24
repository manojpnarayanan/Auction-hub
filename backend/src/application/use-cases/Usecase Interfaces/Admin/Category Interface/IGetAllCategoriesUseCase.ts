
import { CategoryDTO } from "../../../../dtos/CategoryDTO";



export interface IGetAllCategoriesUseCase{
    execute():Promise<CategoryDTO[]>;
}