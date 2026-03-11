import { injectable, inject } from "inversify";
import { TYPES } from "../../../../di/types";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { IGetAllCategoriesUseCase } from "../../Usecase Interfaces/Admin/Category Interface/IGetAllCategoriesUseCase";
import { CategoryDTO } from "../../../dtos/CategoryDTO";
import { categoryDTOMapper } from "../../../DTOMapper/CategoryDTOMapper";
import { Category } from "../../../../domain/entities/Category.entity";


@injectable()

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
    constructor(
        @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository
    ) { }
    async execute(page:number,limit:number,searchTerm:string): Promise<{categories:CategoryDTO[],total:number}> {
        const {categories,total} = await this._categoryRepository.findAll(page,limit,searchTerm);
        return {categories:categories.map((category) => categoryDTOMapper.toDTO(category)),total};
    }
}