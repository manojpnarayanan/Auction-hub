import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {forgotPassword,resetPassword} from '../api/auth';

export default function ForgotPassword(){
    const navigate=useNavigate();
    const [step,setStep]=useState(1); //1=email,2=otp+newPassword
    const [email,setEmail]=useState("");
    const [otp,setOtp]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [msg,setMsg]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSendOTP=async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
        setMsg("");
        try{
            await forgotPassword(email);
            setStep(2);
            setMsg("OTP sent successfully");
        }catch(error:any){
            setError(error.response?.data?.message || "Failed to send otp");
        }finally{
            setLoading(false);
        }
    }
    const handleReset=async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setError("");
        setMsg("");
        try{
            await resetPassword({email,otp,newPassword});
            setMsg("Password Reset Successfully");
            setTimeout(()=>navigate('/login'),1000);

        }catch(err:any){
            setError(err.response?.data?.message || "Reset failed"); 
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-purple-900/80 backdrop-blur-sm"></div>
            
            <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>
                
                {msg && <div className="p-2 mb-3 text-sm text-green-700 bg-green-100 rounded text-center">{msg}</div>}
                {error && <div className="p-2 mb-3 text-sm text-red-700 bg-red-100 rounded text-center">{error}</div>}
                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
                        <button type="submit" disabled={loading} className="w-full bg-[#1da1f2] text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input type="text" placeholder="Enter OTP" required value={otp} onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-center tracking-widest" />
                        <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg" />
                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
                
                <div className="text-center mt-4">
                    <button onClick={() => navigate("/login")} className="text-xs text-gray-500 hover:text-gray-800 underline">Back to Login</button>
                </div>
            </div>
        </div>
    );
}