import { ResolveDisputeDTO } from "../../../dtos/DisputeDTO";


export interface IResolveDisputeUseCase{
    execute(data:ResolveDisputeDTO):Promise<void>;
}