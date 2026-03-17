import API from "../../api/axiosInstances";


export const getAdminAuctionManagement=async (page:number=1,limit:number=10,search:string='')=>{
    return API.get(`/auctions?type=all&category=All&status=all&page=${page}&limit=${limit}&search=${search}`)
};
export const deleteAuction=async(id:string)=>{
    return API.delete(`/admin/auctions/${id}`);
}
export const updateAuctionStatus=async (id:string,status:'active' | 'rejected'|'approved' | 'cancelled',reason?:string)=>{
    return API.patch(`/admin/auctions/${id}/status`,{status,reason});
}

export const cancelLiveAuctionAdmin=async(auctionId:string,reason?:string)=>{
    return API.post(`/auctions/${auctionId}/cancel`,{reason});
}