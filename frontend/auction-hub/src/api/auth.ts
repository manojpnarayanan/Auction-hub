import API from "./axiosInstances";
import type { LoginCredentials,SignupCredentials,AuthResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const signup = (data: SignupCredentials) => API.post<AuthResponse>('user/signup', data);
export const login = (data: LoginCredentials) => API.post<AuthResponse>('user/login', data);
export const googleAuth = () => window.location.href = `${API_URL}/user/auth/google`;
export const forgotPassword = (email: string) => API.post('user/forgot-password', { email });
export const resetPassword = (data: { email: string; otp: string; newPassword: string }) => API.post('user/reset-password', data)
export const resendOtp=(email:string)=>API.post('user/resend-otp',{email});
export const verifyOtp=(data: { email: string; otp: string })=>API.post('user/verify-otp',data);





export default API;