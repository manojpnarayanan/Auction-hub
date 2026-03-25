import API from "../axiosInstances";


export const getAllDisputesAPI= async(page:number,limit:number,status= 'all')=>{
    const response=await API.get(`/admin-dispute/getdisputes?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
} 

export const resolveDisputesAPI=async (disputeId:string,resolution:'refund' | 'reject',adminNote:string)=>{
    const response=await API.post(`admin-dispute/${disputeId}/resolve`,{resolution,adminNote});
    return response.data;
}