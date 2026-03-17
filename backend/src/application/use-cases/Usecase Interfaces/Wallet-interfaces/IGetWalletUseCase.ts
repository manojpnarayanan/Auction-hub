import { WalletResponseDTO,TransactionResponseDTO } from "../../../dtos/WalletDTO";


export interface WalletWithTransactions{
    wallet:WalletResponseDTO;
    transactions:TransactionResponseDTO[];
    total: number;
}

export interface IGetWalletUseCase{
    execute(userId:string, page?: number, limit?: number):Promise<WalletWithTransactions>
}