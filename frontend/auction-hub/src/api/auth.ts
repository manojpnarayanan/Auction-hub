import API from "./axiosInstances";
import type { LoginCredentials,SignupCredentials,AuthResponse } from "../types/auth";


export const signup = (data: SignupCredentials) => API.post<AuthResponse>('user/signup', data);
export const login = (data: LoginCredentials) => API.post<AuthResponse>('user/login', data);
export const googleAuth = () => (code:string)=>API.post<AuthResponse>('user/auth/google',{code});
export const forgotPassword = (email: string) => API.post('user/forgot-password', { email });
export const resetPassword = (data: { email: string; otp: string; newPassword: string }) => API.post('user/reset-password', data)
export const resendOtp=(email:string)=>API.post('user/resend-otp',{email});
export const verifyOtp=(data: { email: string; otp: string })=>API.post('user/verify-otp',data);





export default API;