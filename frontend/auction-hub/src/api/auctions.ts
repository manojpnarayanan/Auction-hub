import API from "./axiosInstances";




export const getMyAuctions=async ()=>{
    return API.get('/auctions/all-auctions');
}
export const getAllAuctions=async (category?:string)=>{
    const url=category && category !=="All" 
    ? `/auctions?category=${category}` : '/auctions';
    return API.get(url);
}
export const createAuction=async (auctionData:any)=>{
    return API.post('/auctions',auctionData);
}

export const getAuctionProductDetails=async(id:string)=>{
    return API.get(`/auctions/${id}`);
}

export const updateAuction=async(id:string,data:any)=>{
    return await API.put(`/auctions/${id}`,data);
}
