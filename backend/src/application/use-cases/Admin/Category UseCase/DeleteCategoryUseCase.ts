import { injectable ,inject } from "inversify";
import {TYPES} from "../../../../di/types";
import { ICategoryRepository } from "../../../../domain/interfaces/ICategoryRepository";
import { IDeleteCategoryUseCase } from "../../Usecase Interfaces/Admin/Category Interface/IDeleteCategoryUseCase";


@injectable()

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase{
    constructor(
        @inject(TYPES.CategoryRepository) private categoryRepository:ICategoryRepository 
    ){}
    async execute(id:string):Promise<boolean>{
        return await this.categoryRepository.delete(id);
    }
}