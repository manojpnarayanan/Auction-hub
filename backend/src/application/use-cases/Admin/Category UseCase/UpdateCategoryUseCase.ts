import { injectable,inject } from "inversify";
import {TYPES} from "../../../../di/types";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { IUpdateCategoryUseCase } from "../../Usecase Interfaces/Admin/Category Interface/IUpdateCategoryUseCase";
import { CategoryDTO, CategoryRequestDTO } from "../../../dtos/CategoryDTO";
import { categoryDTOMapper } from "../../../DTOMapper/CategoryDTOMapper";


@injectable()

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
    constructor(
        @inject (TYPES.CategoryRepository) private categoryRepository:ICategoryRepository
    ){}
    async execute(id: string, data: CategoryRequestDTO): Promise<CategoryDTO | null> {
        const updatedCategory=await this.categoryRepository.update(id,{
            name:data.name,
            description:data.description,
        });
        if(!updatedCategory) return null;
        return categoryDTOMapper.toDTO(updatedCategory);
    }
}