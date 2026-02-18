import { Bid } from "../../../../domain/entities/Bid.entity";
import { PlaceBidDTO } from "../../../dtos/BidDTO";


export interface IPlaceBidUseCase{
    execute(data:PlaceBidDTO):Promise<Bid | null>
}