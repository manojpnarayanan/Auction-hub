import { confirmPaymentDTO } from "../../../dtos/WalletDTO";



export interface IconfirmPaymentUseCase{
    execute(buyerId:string,data:confirmPaymentDTO):Promise<void>;
}