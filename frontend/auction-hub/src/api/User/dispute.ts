import API from "../axiosInstances";



export const confirmDeliveryAPI=async(auctionId:string)=>{
    const response=await API.post("user-dispute/dispute/confirm-delivery",{auctionId});
    return response.data.data;
}

export const raiseDisputeAPI=async(auctionId:string,reason:string,evidence?:string)=>{
    const response=await API.post("user-dispute/dispute/raise",{auctionId,reason,evidence});
    return response.data;
}

export const getMyDisputesAPI=async(page:number,limit:number)=>{
    const response=await API.get(`/user-dispute/dispute?page=${page}&limit=${limit}`);
    return response.data;
}

export const uploadEvidence=async (formData:FormData)=>{
    const response=API.post('/upload',formData,{
        headers:{'Content-Type':'multipart/form-data'}
    });
    return response;
}