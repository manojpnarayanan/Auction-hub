export interface User {
    id: string;
    name: string,
    email: string,
    role: 'user' | 'admin',
    isVerified: boolean,
    isBlocked?: boolean,
    createdAt: string;
}

export interface UsersResponse {
    success?:boolean,
    message?:string,
    data: User[],
    total: number,
    totalPages: number,
    page: number,
}