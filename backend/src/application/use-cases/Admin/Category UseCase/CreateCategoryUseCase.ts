import { ICreatecategoryUseCase } from "../../Usecase Interfaces/Admin/Category Interface/ICreatecategoryUseCase";
import { Category } from "../../../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { injectable,inject } from "inversify";
import { CategoryDTO, CategoryRequestDTO} from "../../../dtos/CategoryDTO";
import { categoryDTOMapper } from "../../../DTOMapper/CategoryDTOMapper";
import {TYPES} from "../../../../di/types";
import { ConflictError } from "../../../../domain/errors/errors";



@injectable()
export class CreateCategoryUseCase implements ICreatecategoryUseCase {
    constructor(
        @inject(TYPES.CategoryRepository)private _categoryRepository:ICategoryRepository
    ) {}
    
    async execute(data: CategoryRequestDTO): Promise<CategoryDTO> {

        const {categories}=await this._categoryRepository.findAll(1,2,data.name)
        // console.log("Cat",categories);

        const checkExists=categories.find((c)=>c.name.toLowerCase()===data.name.trim().toLowerCase());
        if(checkExists) throw new ConflictError("Category already exists");

        const newCategory=new Category (
            "",
            data.name,
            data.description ||'',
            true,
            new Date(),
            new Date(),
        );
        const createdCategory=await this._categoryRepository.create(newCategory);
        

        return categoryDTOMapper.toDTO(createdCategory);
    }
}