
import { CategoryDTO } from "../../../../dtos/CategoryDTO";



export interface IGetAllCategoriesUseCase {
    execute(page?: number, limit?: number,searchTerm?:string): Promise<{ categories: CategoryDTO[], total: number }>;
}
