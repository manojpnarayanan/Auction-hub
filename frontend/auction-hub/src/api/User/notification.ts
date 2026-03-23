import API from "../axiosInstances";
import type { Notification } from "../../types/notification";


export const getNotification=async():Promise<Notification[]>=>{
    const response = await API.get('/user/notifications');
     return response.data.data
}
export const markNotificationRead=async(id:string)=>{
    return API.patch(`/user/notifications/${id}`);
}