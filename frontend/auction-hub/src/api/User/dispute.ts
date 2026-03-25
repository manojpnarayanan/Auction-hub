import API from "../axiosInstances";



export const confirmDeliveryAPI=async(auctionId:string)=>{
    const response=await API.post("user-dispute/dispute/confirm-delivery",{auctionId});
    return response.data.data;
}

export const raiseDisputeAPI=async(auctionId:string,reason:string)=>{
    const response=await API.post("user-dispute/dispute/raise",{auctionId,reason});
    return response.data;
}

export const getMyDisputesAPI=async(page:number,limit:number)=>{
    const response=await API.get(`/user-dispute/dispute?page=${page}&limit=${limit}`);
    return response.data;
}