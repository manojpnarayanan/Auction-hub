import API from "../axiosInstances";


export const getDashboardStats=async(period:'daily'|'monthly'|'yearly')=>{
    const res=await API.get(`admin/stats?period=${period}`)
    return res.data.data
}