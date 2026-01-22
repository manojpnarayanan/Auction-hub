import axios from "axios";
import { Store } from "../redux/store";
import { logout, updateAccessToken } from "../redux/slices/authSlices";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL

let isBlockedAlertShown=false;

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
        if (error.response?.status === 403) {
            const msg = error.response.data.message;
            if ((msg === "user is blocked" || msg === "USer is blocked")
            && !originalRequest.url?.includes('/block')) {
        if(isBlockedAlertShown){
            return Promise.reject(error);
        }
         isBlockedAlertShown=true;

                await Swal.fire({
                    icon: "error",
                    title: "Account Blocked",
                    text: "Your Account has been suspended by Administrator",
                    confirmButtonText: "Logout",
                    confirmButtonColor: "#d33",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
                Store.dispatch(logout());
                localStorage.clear();
                window.location.href = '/login';
                isBlockedAlertShown=false;
                return Promise.reject(error);
            }
        }
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("login")) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${API_URL}/user/refresh-token`, {}, {
                    withCredentials: true
                });
                const newAccessToken = res.data.accessToken;
                Store.dispatch(updateAccessToken(newAccessToken));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                console.error("Session failed", refreshError);
                Store.dispatch(logout());
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
);

export default API