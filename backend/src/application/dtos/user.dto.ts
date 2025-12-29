/**
 * Data Transfer Objects for User operations
 * Used to transfer data between layers without exposing internal structure
 */

/**
 * DTO for creating a new user
 */
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

/**
 * DTO for user response (excludes sensitive data like password)
 */
export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}

/**
 * DTO for login request
 */
export interface LoginDTO {
    email: string;
    password: string;
}

/**
 * DTO for login response
 */
export interface LoginResponseDTO {
    message: string;
    token: string;
    user: UserResponseDTO;
}

// DTO for Google Authentification

export interface GoogleAuthDTO{
    googleId:string;
    email:string;
    name:string;
    picture?:string;
}

// DTO for OAuth response 

export interface OAuthResponseDTO{
    message:string;
    token:string;
    user:UserResponseDTO;
    isNewUser:boolean;
}