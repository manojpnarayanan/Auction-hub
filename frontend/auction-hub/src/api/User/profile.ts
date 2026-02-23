import API from '../axiosInstances';
import type { UpdateProfileData,ChangePasswordData } from '../../types/user-profile';

export const getProfile=()=>API.get('/profile/user-profile');

export const updateProfile=(data:UpdateProfileData)=>{
    return API.put('/profile/user-profile',data);
}

export const changePassword=(data:ChangePasswordData)=>{
    return API.put('/profile/change-password',data)
}