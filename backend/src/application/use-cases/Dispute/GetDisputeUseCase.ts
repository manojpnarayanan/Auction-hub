import { injectable,inject } from "inversify";
import { TYPES } from "../../../di/types";
import { IDisputeRepository } from "../../../domain/interfaces/IDisputeRepository";
import { IGetDisputeUseCase } from "../Usecase Interfaces/Dispute-Interface/IGetDisputeUseCase";
import { DisputeResponseDTO } from "../../dtos/DisputeDTO";
import { DisputeDTOMapper } from "../../DTOMapper/DisputeDTOMapper";


@injectable()
export class GetDisputeUseCase implements IGetDisputeUseCase{
    constructor(
        @inject(TYPES.DisputeRepository) private _disputeRepo:IDisputeRepository
    ){}
    async getBuyerDisputes(buyerId: string, page: number, limit: number): Promise<{ disputes: DisputeResponseDTO[]; total: number; }> {
        const{dispute,total}=await this._disputeRepo.findByBuyerId(buyerId,page,limit);
        return {disputes:dispute.map(DisputeDTOMapper.toDTO),total}    
    }
    async getAllDisputes(page: number, limit: number, status?: string): Promise<{ disputes: DisputeResponseDTO[]; total: number; }> {
        const {disputes,total} = await this._disputeRepo.findAll(page,limit,status);
        return {disputes:disputes.map(DisputeDTOMapper.toDTO),total}
    }
}