export interface AuthUser{
    id:string;
    name:string;
    email:string;
    role:'user'|"admin";
    createdAt:string;
    isBlocked:boolean;
    isVerified:boolean;
}
export interface LoginCredentials{
    email:string;
    password:string;
}
export interface SignupCredentials{
    name:string;
    email:string;
    password:string;
}

export interface AuthResponse{
    success:boolean;
    message:string;
    token:string;
    user:AuthUser;
}