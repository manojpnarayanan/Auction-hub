import { ICreatecategoryUseCase } from "../../Usecase Interfaces/Admin/Category Interface/ICreatecategoryUseCase";
import { Category } from "../../../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { injectable,inject } from "inversify";
import { CategoryDTO, CategoryRequestDTO} from "../../../dtos/CategoryDTO";
import { categoryDTOMapper } from "../../../DTOMapper/CategoryDTOMapper";
import {TYPES} from "../../../../di/types";
@injectable()
export class CreateCategoryUseCase implements ICreatecategoryUseCase {
    constructor(
        @inject(TYPES.CategoryRepository)private categoryRepository:ICategoryRepository
    ) {}
    
    async execute(data: CategoryRequestDTO): Promise<CategoryDTO> {
        const newCategory=new Category (
            "",
            data.name,
            data.description ||'',
            true,
            new Date(),
            new Date(),
        );
        const createdCategory=await this.categoryRepository.create(newCategory);

        return categoryDTOMapper.toDTO(createdCategory);
    }
}