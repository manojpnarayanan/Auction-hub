import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { HttpStatus } from "../../Enums/StatusCodes";
import { IGetAddressUseCase } from "../../../application/use-cases/Usecase Interfaces/Address-Interface/IGetAddressUseCase";
import { IUpdateAddressUseCase } from "../../../application/use-cases/Usecase Interfaces/Address-Interface/IUpdateAddressUseCase";
import { IDeleteAddressUseCase } from "../../../application/use-cases/Usecase Interfaces/Address-Interface/IDeleteAddressUseCase";
import { IAddAddressUseCase } from "../../../application/use-cases/Usecase Interfaces/Address-Interface/IAddAddressUseCase";
import { ISetDefaultUseCase } from "../../../application/use-cases/Usecase Interfaces/Address-Interface/ISetDefaultUseCase";

@injectable()
export class AddressController{
    constructor(
        @inject(TYPES.GetAddressUseCase) private getAddressUseCase:IGetAddressUseCase,
        @inject (TYPES.AddAddressUseCase) private addAddressUseCase:IAddAddressUseCase,
        @inject (TYPES.UpdateAddressUseCase)private updateAddressUseCase:IUpdateAddressUseCase,
        @inject (TYPES.DeleteAddressUseCase) private deleteAddressUseCase:IDeleteAddressUseCase,
        @inject (TYPES.SetDefaultAddressUseCase) private setDefaultUseCase:ISetDefaultUseCase
    ){}
    getAddress=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const userId=req.user?.id;
            if(!userId){
                res.status(HttpStatus.UNAUTHORIZED).json({message:"Unauthorized"});
                return;
            }
            const addresses=await this.getAddressUseCase.execute(userId);
            res.status(HttpStatus.OK).json(addresses);

        }catch(error){
            next(error);
        }
    }
    addAddress=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const userId=req.user?.id;
            if(!userId){
                res.status(HttpStatus.UNAUTHORIZED).json({message:"Unauthorized"});
                return;
            }
            const address=await this.addAddressUseCase.execute(userId,req.body);
            res.status(HttpStatus.OK).json(address);
        }catch(error){
            next(error);
        }
    }
    updateAddress=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const {id}=req.params;
            const address=await this.updateAddressUseCase.execute(id,req.body);
            res.status(HttpStatus.OK).json(address);
        }catch(error){
            next(error);
        }
    }
    deleteAddress=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const {id}=req.params;
            await this.deleteAddressUseCase.execute(id);
            res.status(HttpStatus.OK).json({message:"Address Deleted successfully"})
        }catch(error){
            next(error);
        }
    }
    setDefault=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const userId=req.user?.id;
            const {id}=req.params;
            if(!userId){
                res.status(HttpStatus.UNAUTHORIZED).json({message:"Unauthorized"});
                return;
            }
            await this.setDefaultUseCase.execute(userId,id);
            res.status(HttpStatus.OK).json({message:"Default address updated"});
        }catch(error){
            next(error);
        }
    }
}