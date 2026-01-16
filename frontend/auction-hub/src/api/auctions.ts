import axios from "axios";



const API_URL=import.meta.env.VITE_API_URL


const api=axios.create({baseURL:API_URL})

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
})
export const getMyAuctions=async ()=>{
    return api.get('/auctions/all-auctions');
}
export const getAllAuctions=async ()=>{
    return api.get('/auctions');
}
export const createAuction=async (auctionData:any)=>{
    return api.post('/auctions',auctionData);
}
