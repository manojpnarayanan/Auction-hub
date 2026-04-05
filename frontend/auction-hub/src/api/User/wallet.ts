import type { AxiosResponse } from "axios";
import API from "../axiosInstances";
import type { WalletWithTransactions,CreatePaymentIntentRequest } from "../../types/wallet";
import type { ApiResponse } from "../../types/api";

export const getWallet=(page:number=1,limit:number=10):Promise<AxiosResponse<ApiResponse<WalletWithTransactions>>>=>{
    return API.get(`/user/getwallet?page=${page}&limit=${limit}`);
}

export const createPaymentIntent=(data:CreatePaymentIntentRequest):Promise<AxiosResponse<ApiResponse<{clientSecret:string;paymentIntentId:string}>>>=>{
    return API.post('/user/payment',data);
}

export const confirmPayment=(data:{paymentIntentId:string;auctionId:string}):Promise<AxiosResponse<void>>=>{
    return API.post('/user/payment/confirm',data);
}