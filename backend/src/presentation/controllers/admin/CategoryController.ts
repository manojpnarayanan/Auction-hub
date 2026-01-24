import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import {TYPES} from "../../../di/types";
import { ICreatecategoryUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/Category Interface/ICreatecategoryUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { IGetAllCategoriesUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/Category Interface/IGetAllCategoriesUseCase";
import { IUpdateCategoryUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/Category Interface/IUpdateCategoryUseCase";
import { IDeleteCategoryUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/Category Interface/IDeleteCategoryUseCase";
import { ApiResponse } from "../../Common/APIResponse";

@injectable()
export class CategoryController{
    constructor(
        @inject(TYPES.CreateCategoryUseCase) private createCategoryUseCase:ICreatecategoryUseCase,
        @inject (TYPES.GetAllCategoriesUseCase) private getAllCategoryUseCase:IGetAllCategoriesUseCase,
        @inject(TYPES.UpdateCategoryUSeCase) private updateCategoryUseCase:IUpdateCategoryUseCase,
        @inject(TYPES.DeleteCategoryUseCase)private deleteCategoryUseCase:IDeleteCategoryUseCase,

    ){}
     create= async (req:Request, res:Response, next:NextFunction)=>{
        try{
            const category=await this.createCategoryUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json(category);
        }catch(error){
            next(error)
    }
    }
    getAllCategories=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const categories=await this.getAllCategoryUseCase.execute();
            const response=ApiResponse.success(categories,'Categories Fetched Successfully')
            return res.status(response.statusCode).json(response);
        }catch(error){
            next(error);
        }
    }
    update=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            const category=await this.updateCategoryUseCase.execute(id,req.body);
            if(!category){
                res.status(HttpStatus.NOT_FOUND).json({message:"Category not Found"});
            };
            return res.status(HttpStatus.OK).json(category);
        }catch(error){
            next(error);
        }
    }
    delete=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            const success=await this.deleteCategoryUseCase.execute(id);
            if(!success){
                return res.status(HttpStatus.NOT_FOUND).json({message:"Category not found or could be deleted"})
            };
            res.status(HttpStatus.OK).json({message:"Category deleted successfully"});
        }catch(error){
            next(error);
        }
    }
}