import { TransactionResponseDTO } from "../../../dtos/WalletDTO";


export interface IGetPendingReleaseUseCase{
    execute():Promise<TransactionResponseDTO[]>
}