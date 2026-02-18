import API from "../axiosInstances";


export const placeBid=(auctionId:string,amount:number)=>{
    return API.post("/bids",{auctionId,amount});
};

export const getBids=(auctionId:string)=>{
    return API.get(`/bids/${auctionId}`);
}
export const getMyBids=()=>{
    return API.get("/bids/my-bids")
}