import { ICategoryRepository } from "../../../domain/interfaces/ICategoryRepository";
import { Category } from "../../../domain/entities/Category.entity";
import { CategoryModel } from "../models/CategoryModel";
import { CategoryPersistanceMapper } from "../Mappers/CategoryPersistanceMapper";



export class MongoCategoryRepository implements ICategoryRepository {
    async create(category: Category): Promise<Category> {
        const newCategory=await CategoryModel.create(category);
        return CategoryPersistanceMapper.toEntity(newCategory)
    }
    async findById(id: string): Promise<Category | null> {
        const category=await CategoryModel.findById(id);
        if(!category) return null;
        return CategoryPersistanceMapper.toEntity(category);
    }
    async findAll(): Promise<Category[]> {
        const categories=await CategoryModel.find();
        return categories.map((c)=>CategoryPersistanceMapper.toEntity(c)) 
    }
    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        const updated=await CategoryModel.findByIdAndUpdate(id,data,{new:true});
        return updated? CategoryPersistanceMapper.toEntity(updated): null
    }
    async delete(id: string): Promise<boolean> {
        const result=await CategoryModel.findByIdAndDelete(id);
        return !!result;
    }
}