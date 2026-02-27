import  { Request, Response, NextFunction } from 'express';
import { injectable,inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IHandleWebhookUseCase } from '../../application/use-cases/Usecase Interfaces/Wallet-interfaces/IHandleWebhookUseCase';
import { HttpStatus } from '../Enums/StatusCodes';



@injectable()
export class WebhookController{
    constructor(
        @inject(TYPES.HandleWebhookUseCase) private handleWebhookUseCase:IHandleWebhookUseCase
    ){}
    handleStripeWebhook=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const signature=req.headers['stripe-signature'] as string;
            await this.handleWebhookUseCase.execute(req.body as Buffer,signature);
            res.status(HttpStatus.OK).json({received:true});
        }catch(error){
            next(error);
        }
    }
}