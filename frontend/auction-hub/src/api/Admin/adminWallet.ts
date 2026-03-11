import API from "../axiosInstances";

export const getWallet=async (page:number,limit:number)=>{
    return await API.get(`/user/getwallet?page=${page}&limit=${limit}`)
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