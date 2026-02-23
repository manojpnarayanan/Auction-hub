export interface UpdateProfileData{
    name?:string,
    phone?:string;
    profileImage?:string;
}

export interface ChangePasswordData{
    oldPassword:string;
    newPassword:string;
}