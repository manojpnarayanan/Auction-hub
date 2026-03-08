import API from "../axiosInstances";
import type { AxiosResponse } from "axios";
import  type { watchlistDTO } from "../../types/watchlist";



export const getWatchlist=():Promise<AxiosResponse<{data:watchlistDTO[]}>>=>{
    return API.get('/user/watchlist');
}
export const addToWatchlist=(auctionId:string):Promise<AxiosResponse<void>>=>{
    return API.post(`/user/watchlist/${auctionId}`);
}

export const removeFromWatchlist=(auctionId:string):Promise<AxiosResponse<void>>=>{
    return API.delete(`/user/watchlist/${auctionId}`);
}
export const checkWatchlist=(auctionId:string):Promise<AxiosResponse<{data:{isWatchlisted:boolean}}>>=>{
    return API.get(`/user/watchlist/${auctionId}/check`)
}

