export interface CategoryDTO{
    id:string;
    name:string;
    description?:string;
    isActive:boolean;
    createdAt:Date;
    
}

export interface CategoryRequestDTO{
    name:string;
    description?:string;
}