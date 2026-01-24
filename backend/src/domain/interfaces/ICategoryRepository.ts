 import { Category } from "../entities/Category.entity";


 export interface ICategoryRepository{
    create(category:Category):Promise<Category>;
    findById(id:string):Promise<Category | null>;
    findAll():Promise<Category[]>;
    update(id:string,category:Partial<Category>):Promise<Category | null>;
    delete(id:string):Promise<boolean>
 }