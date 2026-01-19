import API from '../axiosInstances';
import type { UsersResponse } from '../../types/admin';




export const adminLogin = async (credentials: { email: string; password: string }) => {
    return API.post(`/admin/login`, credentials);
}
export const getUsers = async (page: number, search: string, token: string) => {
    return API.get<UsersResponse>(`/admin/users`, {
        params: { page, limit: 5, search },
        headers: { Authorization: `Bearer ${token}` }
    })
}
export const toggleUserBlock = async (userId: string, isBlocked: boolean,token :string) => {
    // console.log(`Toggling back for ${userId} to ${shouldBlock}`);
    return API.patch(`/admin/users/${userId}/block`,{isBlocked},{headers:{
        Authorization:`Bearer ${token}`
    }})
}
