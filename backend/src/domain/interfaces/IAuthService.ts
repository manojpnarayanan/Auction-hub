import { CreateUserDTO, LoginDTO, UserResponseDTO, LoginResponseDTO
    ,GoogleAuthDTO, OAuthResponseDTO
 } from "../../application/dtos/user.dto";


export interface IAuthService {
    
    signup(data: CreateUserDTO): Promise<UserResponseDTO>;
    login(data: LoginDTO): Promise<LoginResponseDTO>;
    googleAuth(data:GoogleAuthDTO):Promise<OAuthResponseDTO>
}
