import type { AxiosResponse } from "axios";
import API from "../axiosInstances";
import type { WalletWithTransactions,CreatePaymentIntentRequest } from "../../types/wallet";



export const getWallet=():Promise<AxiosResponse<WalletWithTransactions>>=>{
    return API.get('/user/getwallet');
}

export const createPaymentIntent=(data:CreatePaymentIntentRequest):Promise<AxiosResponse<{clientSecret:string;paymentIntentId:string}>>=>{
    return API.post('/user/payment',data);
}

export const confirmPayment=(data:{paymentIntentId:string;auctionId:string}):Promise<AxiosResponse<void>>=>{
    return API.post('/user/payment/confirm',data);
}
