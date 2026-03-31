import { RaiseDisputeDTO } from "../../../dtos/DisputeDTO";


export interface IRaiseDisputeUseCase{
    execute(data:RaiseDisputeDTO):Promise<void>;
}