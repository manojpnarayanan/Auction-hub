import API from "../axiosInstances";



export const getSubscription =async()=>{
    return API.get('/user/user-subscription')
}
export const subscribeToPlan=async(planId:string,plan:string)=>{
    return API.post('/user/user-subscribe',{planId,plan})
}
export const createSubscriptionPaymentIntent = (planId: string, planName: string) => {
    return API.post('/user/create-payment-intent', { planId, planName });
};

export const confirmSubscriptionPayment=(paymentIntentId:string,planId:string,planName:string)=>{
    return API.post('/user/confirm-payment',{paymentIntentId,planId,planName});
}