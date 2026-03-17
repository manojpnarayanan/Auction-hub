import type { AuctionItem } from "../types/auction";
import API from "./axiosInstances";



export const getAllCategories=async()=>{
    return API.get('/admin/category');
}

export const getMyAuctions=async (page:number,limit:number)=>{
    return API.get(`/auctions/all-auctions?page=${page}&limit=${limit}`);
}

export const getAllAuctions=async (filters:{category?:string,search?:string,type?:string})=>{
    
    const params=new URLSearchParams();
    if(filters.category && filters.category!== "All")
        params.append("category",filters.category);
    if(filters.search){
        params.append("search" ,filters.search);
    }
    if(filters.type){
        params.append("type",filters.type);
    }
    return API.get(`auctions?${params.toString()}`);
}

export const createAuction=async (auctionData:AuctionItem)=>{
    return API.post('/auctions',auctionData);
}

export const getAuctionProductDetails=async(id:string)=>{
    return API.get(`/auctions/${id}`);
}

export const updateAuction=async(id:string,data:Partial<AuctionItem>)=>{
    return await API.put(`/auctions/${id}`,data);
}

export const startLiveAuction=(id:string)=>{
     return API.post(`/auctions/${id}/start`);
}

export const endLiveAuction=(id:string)=>{
    return API.post(`/auctions/${id}/end`);
}

export const cancelLiveAuction=(id:string)=>{
    return API.post(`/auctions/${id}/cancel`);
}

export const requestCancellation=async (id:string,reason:string)=>{
    return API.post(`/auctions/${id}/request-cancel`,{reason});
}

