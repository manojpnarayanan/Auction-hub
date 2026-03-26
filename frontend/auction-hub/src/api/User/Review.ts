import API from "../axiosInstances";



export const addReview=async (auctionId:string,rating:number,comment:string)=>{
    const response=await API.post('/reviews/add',{auctionId,rating,comment});
    return response.data;
}

export const getSellerReviews=async (sellerId:string,page:number,limit:number)=>{
    const response=await API.get(`/reviews/${sellerId}?page=${page}&limit=${limit}`);
    return response.data;
}