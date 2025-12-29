import { CreateUserDTO, LoginDTO, UserResponseDTO, LoginResponseDTO
    ,GoogleAuthDTO, OAuthResponseDTO
 } from "../../application/dtos/user.dto";

/**
 * Authentication service interface
 * Following the Dependency Inversion Principle
 */
export interface IAuthService {
    /**
     * Register a new user
     */
    signup(data: CreateUserDTO): Promise<UserResponseDTO>;

    /**
     * Authenticate user and return token
     */
    login(data: LoginDTO): Promise<LoginResponseDTO>;

    googleAuth(data:GoogleAuthDTO):Promise<OAuthResponseDTO>
}
