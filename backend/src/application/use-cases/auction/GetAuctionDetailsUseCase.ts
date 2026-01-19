import { injectable ,inject } from "inversify";
import {TYPES} from "../../../di/types";
import { IGetAuctionDetailsUseCase } from "../Usecase Interfaces/Auction-Interface/IGetAuctionDetailsUseCase";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction.entity";


@injectable()

export class GetAuctionDetailsUSeCase implements IGetAuctionDetailsUseCase{
    constructor(
        @inject(TYPES.AuctionRepository) private auctionRepository:IAuctionRepository
    ) { };
    async execute(id: string): Promise<Auction | null> {
        return this.auctionRepository.findById(id);
    }
}