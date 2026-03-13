import { useState } from "react";
import { createPaymentIntent } from "../api/User/wallet";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";


export interface PaymentSession{
    clientSecret:string;
    paymentIntentId:string;
}

export function usePayment(){
    const [paymentSession,setPaymentSession]=useState<PaymentSession | null>(null);
    const [initiating,setInitiating]=useState(false);
    const initiatePayment=async (auctionId:string,amount:number)=>{
        setInitiating(true);
        try{
            const res=await createPaymentIntent({auctionId,amount});
            setPaymentSession({
                clientSecret:res.data.clientSecret,
                paymentIntentId:res.data.paymentIntentId
            });
        }catch(err:unknown){
            const error=err as AxiosError<{message:string}>
            toast.error(error?.response?.data?.message || "Failed to initiate payment")
        }finally{
            setInitiating(false);
        }
    };
    const closePayment=()=>setPaymentSession(null);
    return{
        paymentSession,initiating,
        initiatePayment,closePayment
    }
}