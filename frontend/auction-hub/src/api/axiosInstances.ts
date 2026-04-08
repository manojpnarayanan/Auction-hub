import axios from "axios";
import { Store } from "../redux/store";
import { logout, updateAccessToken } from "../redux/slices/authSlices";
import toast from "react-hot-toast";
import { MESSAGES } from "../Constants/messages";
import { ROUTES } from "../Constants/routes";

const DEV_API_URL=import.meta.env.VITE_DEV_URL;
const PROD_API_URL = import.meta.env.VITE_API_URL;

let isBlockedAlertShown = false;

const API_URL=window.location.hostname=== 'localhost' ? DEV_API_URL :PROD_API_URL;

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

API.interceptors.request.use((req) => {
    const token = Store.getState().auth.token;
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
})

API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // --- 1. Handle 403 (Blocked) ---
        if (error.response?.status === 403) {
            const msg = (error.response.data?.message || "").toLowerCase();

            if ((msg.includes('blocked') || msg.includes('suspended')) && !originalRequest.url?.includes('/block')) {
                if (!isBlockedAlertShown) {
                    isBlockedAlertShown = true;
                    toast.error(MESSAGES.USER_IS_BLOCKED);

                    Store.dispatch(logout());
                    localStorage.clear();
                    sessionStorage.clear();

                    window.location.replace(ROUTES.LOGIN);
                }
                return new Promise(() => { });
            }
        }

        // --- 2. Handle 401 
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("login")) {
            originalRequest._retry = true;
            try {

                const res = await axios.post(`${API_URL}/user/refresh-token`, {}, { withCredentials: true });
                const newAccessToken = res.data.data.accessToken;


                Store.dispatch(updateAccessToken(newAccessToken));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


                return API(originalRequest);
            } catch (refreshError) {
                console.error("Session failed", refreshError);
                Store.dispatch(logout());
                window.location.href = ROUTES.LOGIN;
            }
        }

        return Promise.reject(error);
    }
);

export default API;
