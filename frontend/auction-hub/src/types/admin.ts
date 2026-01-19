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
    users: User[],
    totalUsers: number,
    totalPages: number,
    currentpage: number,
}