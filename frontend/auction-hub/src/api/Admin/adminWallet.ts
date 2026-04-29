import API from "../axiosInstances";

export const getWallet=async (page:number,limit:number,purpose?:string)=>{
    let url = `/user/getwallet?page=${page}&limit=${limit}`;
    if (purpose) url += `&purpose=${purpose}`;
    return await API.get(url);
}
export const getPendingRelease=async()=>{
    return await API.get('/admin/pending-release');
}

export const releasePayment=async(data:{
    transactionId:string,
    auctionId?:string,
    sellerId:string,
    amount:number,
    commissionPercent:number,
    sellerAmount:number
})=>{
    return API.post("/admin/release/payments",data)
}