import { CreateUserDTO ,LoginResponseDTO } from "../../dtos/user.dto";


export interface ISignupUseCase{
    execute(userData:CreateUserDTO):Promise<LoginResponseDTO>
}