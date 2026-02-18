import { injectable,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { IDeleteAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IDeleteAuctionUseCase";

@injectable()


export class DeleteAuctionUseCase implements IDeleteAuctionUseCase{
    constructor(
       @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ){}
    async execute(id: string): Promise<boolean> {
        return await this.auctionRepository.delete(id);
    }
}