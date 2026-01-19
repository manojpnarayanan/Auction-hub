import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAdminUserManagementUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/IAdminUserManagementUseCase";
import { IBlockUserUseCase } from "../../../application/use-cases/Usecase Interfaces/Admin/IBlockUserUseCase";


@injectable()
export class AdminController{
    constructor(
        @inject(TYPES.AdminUserManagementUseCase) private adminUserManagementUseCase:IAdminUserManagementUseCase,
        @inject (TYPES.BlockUserUseCase) private blockUserUseCase:IBlockUserUseCase
    ){};
    async getUsers(req:Request,res:Response,next:NextFunction){
        try{
            const page=parseInt(req.query.page as string) ||1
            const limit=parseInt(req.query.limit as string) || 5;
            const search=req.query.search as string || "";
            // const query:any={role:"user"};
            const result=await this.adminUserManagementUseCase.execute(page,limit,search);
            
            res.status(200).json({
                users:result.users,
                totalPage:Math.ceil(result.total/limit),
                currentPage:page,
                totalUsers:result.total
            });
        }catch(error){
            next(error);
        }
    }
    async BlockUser(req:Request,res:Response,next:NextFunction){
        try{
            const {userId} =req.params;
            const {isBlocked}=req.body;

            await this.blockUserUseCase.execute(userId,isBlocked);
            res.status(200).json({message:`User ${isBlocked? "blocked" :"unblocked"} successfully`});
        }catch(error){
            next(error);
        }
    }
}