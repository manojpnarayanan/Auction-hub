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
        @inject(TYPES.CreateCategoryUseCase) private _createCategoryUseCase:ICreatecategoryUseCase,
        @inject (TYPES.GetAllCategoriesUseCase) private _getAllCategoryUseCase:IGetAllCategoriesUseCase,
        @inject(TYPES.UpdateCategoryUSeCase) private _updateCategoryUseCase:IUpdateCategoryUseCase,
        @inject(TYPES.DeleteCategoryUseCase)private _deleteCategoryUseCase:IDeleteCategoryUseCase,

    ){}
     create= async (req:Request, res:Response, next:NextFunction)=>{
        try{
            const category=await this._createCategoryUseCase.execute(req.body);
            res.status(HttpStatus.CREATED).json(category);
        }catch(error){
            next(error)
    }
    }
    getAllCategories=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const page=parseInt(req.query.page as string) || 1;
            const limit=parseInt(req.query.limit as string) || 5
            const searchTerm=req.query.searchTerm as string
            const categories=await this._getAllCategoryUseCase.execute(page,limit,searchTerm);
            const response=ApiResponse.success(categories,'Categories Fetched Successfully')
            return res.status(response.statusCode).json(response);
        }catch(error){
            next(error);
        }
    }
    update=async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id}=req.params;
            const category=await this._updateCategoryUseCase.execute(id,req.body);
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
            const success=await this._deleteCategoryUseCase.execute(id);
            if(!success){
                return res.status(HttpStatus.NOT_FOUND).json({message:"Category not found or could be deleted"})
            };
            res.status(HttpStatus.OK).json({message:"Category deleted successfully"});
        }catch(error){
            next(error);
        }
    }
}