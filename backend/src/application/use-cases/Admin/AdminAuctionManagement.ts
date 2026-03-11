import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IAdminAuctionManagamentUseCase } from "../Usecase Interfaces/Admin/IAdminAuctionManagement";
@injectable()

export class ApproveAuctionUseCase implements IAdminAuctionManagamentUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository:IAuctionRepository
    ){}
    async execute(auctionId:string,status:'active' | 'rejected'):Promise <void>{
        await this._auctionRepository.updateAuctionStatus(auctionId,status);
    }
}