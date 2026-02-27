import { WalletResponseDTO,TransactionResponseDTO } from "../../../dtos/WalletDTO";


export interface WalletWithTransactions{
    wallet:WalletResponseDTO;
    transactions:TransactionResponseDTO[];
}

export interface IGetWalletUseCase{
    execute(userId:string):Promise<WalletWithTransactions>
}