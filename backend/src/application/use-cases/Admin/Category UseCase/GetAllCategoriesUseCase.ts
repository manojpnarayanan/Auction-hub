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
        @inject(TYPES.CategoryRepository) private categoryRepository: ICategoryRepository
    ) { }
    async execute(): Promise<CategoryDTO[]> {
        const categories = await this.categoryRepository.findAll();
        return categories.map((category) => categoryDTOMapper.toDTO(category));
    }
}