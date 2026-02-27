import { releasePaymentDTO } from "../../../dtos/WalletDTO";



export interface IReleasePaymentUseCase{
    execute(data:releasePaymentDTO):Promise<void>
}