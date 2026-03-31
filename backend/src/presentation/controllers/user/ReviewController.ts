import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { ICreateReviewUseCase } from "../../../application/use-cases/Usecase Interfaces/Review-Interface/ICreateReviewUseCase";
import { IGetSellerReviewUseCase } from "../../../application/use-cases/Usecase Interfaces/Review-Interface/IGetSellerReviewUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";


@injectable()
export class ReviewController{
    constructor(
        @inject(TYPES.CreateReviewUseCase) private _createReviewUseCase:ICreateReviewUseCase,
        @inject(TYPES.GetSellerReviewUseCase) private _getSellerReviewUseCase:IGetSellerReviewUseCase
    ){}
    addReview=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const buyerId=req.user!.id;
            const data ={...req.body,buyerId}
            await this._createReviewUseCase.execute(data);
            res.status(HttpStatus.CREATED).json({success:true,message:"Review Addded successfully"});
        }catch(error){
            next(error);
        }
    }
    getSellerReviews=async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const sellerId=req.params.sellerId;
            const page=parseInt(req.query.page as string);
            const limit=parseInt(req.query.limit as string);
            const result=await this._getSellerReviewUseCase.execute(sellerId,page,limit);
            res.status(HttpStatus.OK).json({success:true,data:result});
        }catch(error){
            next(error);
        }
    }
}