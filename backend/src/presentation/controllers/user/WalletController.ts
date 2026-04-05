import { Request,Response,NextFunction } from "express";
import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IGetWalletUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IGetWalletUseCase";
import { ICreatePaymentIntentUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/ICreatePaymentIntentUseCase";
import { IconfirmPaymentUseCase } from "../../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IConfirmPaymentUseCase";
import { HttpStatus } from "../../Enums/StatusCodes";
import { CustomMessages } from "../../Enums/CustomMessages";
import { ApiResponse } from "../../Common/APIResponse";


@injectable()
export class WalletController{
    constructor(
        @inject(TYPES.GetWalletUseCase) private _getWalletUseCase:IGetWalletUseCase,
        @inject(TYPES.CreatePaymentIntentUseCase) private _createPaymentIntentUseCase:ICreatePaymentIntentUseCase,
        @inject(TYPES.ConfirmPaymentUseCase) private _confirmPaymentUseCase:IconfirmPaymentUseCase
    ){}
    getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) { res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED)); return }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this._getWalletUseCase.execute(userId, page, limit);
            res.status(HttpStatus.OK).json(ApiResponse.success(result, CustomMessages.WALLET_FETCHED));
        } catch (error) {
            next(error);
        }
    }
    createPaymentIntent=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const userId=req.user?.id;
            if(!userId){
                res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(CustomMessages.UNAUTHORIZED));
                return;
            }
            const result=await this._createPaymentIntentUseCase.execute(userId,req.body);
            res.status(HttpStatus.OK).json(ApiResponse.success(result))
        }catch(error){
            next(error);
        }
    };
    confirmPayment=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const userId=req.user?.id;
            if(!userId){
                res.status(HttpStatus.UNAUTHORIZED).json( ApiResponse.error(CustomMessages.UNAUTHORIZED));
                return;
            }
            await this._confirmPaymentUseCase.execute(userId,req.body);
            res.status(HttpStatus.OK).json(ApiResponse.ok(CustomMessages.PAYMENT_CONFIRMED));
        }catch(error){
            next(error);
        }
    }
}