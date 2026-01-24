import { CategoryDTO ,CategoryRequestDTO } from "../../../../dtos/CategoryDTO" 


export interface IUpdateCategoryUseCase{
    execute(id:string,data:CategoryRequestDTO):Promise<CategoryDTO | null >
};