import axios from "axios";
import { Store } from "../redux/store";
import { logout, updateAccessToken } from "../redux/slices/authSlices";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API = axios.create({ baseURL: API_URL, withCredentials:true });

// Request Interceptor: Attach Token from Redux
API.interceptors.request.use((req) => {
    const token = Store.getState().auth.token;
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Response interceptor :Handle Refresh Logic
API.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const res=await axios.post(`${API_URL}/user/refresh-token`,{},{withCredentials:true});

            const newAccessToken = res.data.accessToken;
            // Dispatch action to update Redux Store
            Store.dispatch(updateAccessToken(newAccessToken));
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return API(originalRequest);
        } catch (refreshError) {
            // If refresh fails (e.g., Refresh Token expired too), Log Out
            console.error("Session Expired", refreshError);
            Store.dispatch(logout());
            window.location.href = '/login';
        }

    }
    return Promise.reject(error);

});
export const signup = (data: any) => API.post('user/signup', data);
export const login = (data: any) => API.post('user/login', data);
export const googleAuth = () => window.location.href = `${API_URL}/user/auth/google`;
export const forgotPassword = (email: string) => API.post('user/forgot-password', { email });
export const resetPassword = (data: any) => API.post('user/reset-password', data)
export default API;