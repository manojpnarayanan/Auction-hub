
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    googleId?: string;
    role?: string;
    isVerified?: boolean;
}


export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    message: string;
    token: string;
    refreshToken: string;
    user: UserResponseDTO;
}

export interface GoogleAuthDTO {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
}


export interface OAuthResponseDTO {
    message: string;
    token: string;
    refreshToken: string;
    user: UserResponseDTO;
    isNewUser: boolean;
}