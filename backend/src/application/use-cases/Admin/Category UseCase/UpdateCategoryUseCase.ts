import { injectable,inject } from "inversify";
import {TYPES} from "../../../../di/types";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { IUpdateCategoryUseCase } from "../../Usecase Interfaces/Admin/Category Interface/IUpdateCategoryUseCase";
import { CategoryDTO, CategoryRequestDTO } from "../../../dtos/CategoryDTO";
import { categoryDTOMapper } from "../../../DTOMapper/CategoryDTOMapper";
import { ConflictError } from "../../../../domain/errors/errors";


@injectable()

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
    constructor(
        @inject (TYPES.CategoryRepository) private categoryRepository:ICategoryRepository
    ){}
    async execute(id: string, data: CategoryRequestDTO): Promise<CategoryDTO | null> {
        // const updatedCategory=await this.categoryRepository.update(id,{
        //     name:data.name,
        //     description:data.description,
        // });
        // if(!updatedCategory) return null;
        const {categories}=await this.categoryRepository.findAll(1,5,data.name)
        const check=categories.find((c)=>c.name.toLowerCase()===data.name.trim().toLowerCase());

        if(check) throw new ConflictError("Category with this name already exists");

        const category=await this.categoryRepository.findById(id);
        if(!category) return null;
        category.updateDetails(data.name,data.description || '');
        await this.categoryRepository.update(id,category)
        return categoryDTOMapper.toDTO(category);
    }
}