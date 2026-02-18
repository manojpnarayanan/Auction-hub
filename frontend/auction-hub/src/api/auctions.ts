import API from "./axiosInstances";



export const getAllCategories=async()=>{
    return API.get('/admin/category');
}

export const getMyAuctions=async ()=>{
    return API.get('/auctions/all-auctions');
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

export const createAuction=async (auctionData:any)=>{
    return API.post('/auctions',auctionData);
}

export const getAuctionProductDetails=async(id:string)=>{
    return API.get(`/auctions/${id}`);
}

export const updateAuction=async(id:string,data:any)=>{
    return await API.put(`/auctions/${id}`,data);
}


