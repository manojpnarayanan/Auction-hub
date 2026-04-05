import API from "../axiosInstances";

export interface SubscriptionPlanFormData {
    name: string;
    price: number;
    auctionsPerYear: number;
    maxDays: number;
    hasLive: boolean;
    commission: number;
}

export const CreateSubscriptionPlan = async (data: SubscriptionPlanFormData) => {
    const response = await API.post('/admin/create-subscription', data);
    return response;
};

export const getAllSubscriptionPlan = async () => {
    return API.get('/admin/subcriptionplans');
};

export const updateSubscriptionPlan = async (id: string, data: Partial<SubscriptionPlanFormData>) => {
    return API.put(`/admin/subcriptionplans/${id}`, data);
};

export const deleteSubscriptionPlan = async (id: string) => {
    return API.delete(`/admin/subcriptionplans/${id}`);
};