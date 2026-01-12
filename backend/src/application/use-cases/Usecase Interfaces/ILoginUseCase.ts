import { LoginDTO , LoginResponseDTO } from "../../dtos/user.dto";

export interface ILoginUseCase{
    execute(credentials:LoginDTO):Promise<LoginResponseDTO>
}