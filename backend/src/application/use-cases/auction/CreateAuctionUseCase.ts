import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IAuctionRepository } from "../../../domain/interfaces/IAuctionRepository";
import { ICreateAuctionUseCase } from "../Usecase Interfaces/Auction-Interface/IAuctionUseCase";
import { Auction } from "../../../domain/entities/Auction.entity";
import { CreateAuctionDTO } from "../../dtos/AuctionDTO";
import { AuctionDTOMapper } from "../../DTOMapper/AuctionDTOMapper";
import { AuctionResponseDTO } from "../../dtos/AuctionDTO";
import { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { PLAN_LIMITS } from "../../../config/SubscriptionConfig";
import { ValidationError } from "../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../domain/interfaces/ISubscriptionPlanRepository";

@injectable()

export class CreateAuctionUseCase implements ICreateAuctionUseCase {
    constructor(
        @inject(TYPES.AuctionRepository) private _auctionRepository: IAuctionRepository,
        @inject(TYPES.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository,
        @inject (TYPES.SubscriptionPlanRepository)private _subscriptionPlanRepository:ISubscriptionPlanRepository
    ) { }
    async execute(data: CreateAuctionDTO): Promise<AuctionResponseDTO> {
        const subscription=await this._subscriptionRepository.findActiveByUSerId(data.sellerId);
        let activePlan;
        if(subscription){
            activePlan=await this._subscriptionPlanRepository.findById(subscription.planId);
        }else{
            const allPlans=await this._subscriptionPlanRepository.findAll();
            activePlan=allPlans.find(plan=>plan.isDefault && plan.isActive);
        }
        if(!activePlan){
            throw new Error("No available sunscription plans found.");
        }
        const planName=activePlan.name;
        
        
        const auctionCount=await this._subscriptionRepository.countAuctionsThisYear(data.sellerId);
        if(auctionCount>=activePlan.auctionsPerYear){
            throw new ValidationError(`Your ${planName} plan allows only ${activePlan.auctionsPerYear} auctions per year`);
        }
        const durationDays=(new Date(data.endDate).getTime()-Date.now())/(1000*60*60*24)
        if(durationDays > activePlan.maxDays){
            throw new ValidationError(`your ${planName} plan allows a maximum auction duration of ${activePlan.maxDays} days`);
        }
        if(data.type==='live' && !activePlan.hasLive){ 
            throw new ValidationError(`Live Auctions are available only on ${planName} plan`);
        }
        if(data.type==='live'){
            const startTime=data.startTime?new Date(data.startTime):new Date();
            const durationHours=(new Date(data.endDate).getTime()-startTime.getTime())/(1000*60*60);
            if(durationHours>2){
                throw new ValidationError("Live auction cannot exceeded 2 hours in duration");
            }
        }
        // console.log("data", data);
        const newAuction = new Auction(
            data.title,
            data.description,
            data.category,
            data.startingPrice,
            data.currentPrice,
            new Date(data.endDate),
            data.sellerId,
            data.images || [],
            "pending",
            undefined,
            data.type,
            data.startTime ? new Date(data.startTime) : undefined,
        );
        const createdAuction = await this._auctionRepository.create(newAuction);
        return AuctionDTOMapper.toResponseDTO(createdAuction);


    }
}