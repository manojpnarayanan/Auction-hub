import { useState,useEffect } from "react";
import axios from "axios";

interface OTPModalProps{
    email:string;
    onClose:()=>void;
    onSuccess:()=>void;
}

const OTPModal=({email,onClose,onSuccess}:OTPModalProps)=>{

    const [otp,setOtp]=useState("");
    const [timer,setTimer]=useState(60);
    const [loading,setloading] =useState(false);
    const [message,setMessage]=useState<{text:string;type:"success" | "error"}|null>(null);

    useEffect(()=>{
        let interval:any;
        if(timer>0){
            interval=setInterval(()=>setTimer((prev)=>prev-1),1000)
        }
        return(()=>clearInterval(interval));
    },[timer]);

    const handleVerify=async()=>{
        setloading(true);
        try{
            await axios.post('http://localhost:3000/user/verify-otp',{email,otp});
            onSuccess();
        }catch(error:any){
           setMessage({text:error.response?.data?.message||"Failed",type:"error"})
        }finally{
            setloading(false);
        }
    };
    return(
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-4">
          Code sent to <b>{email}</b>
        </p>
        {message && (
  <div className={`p-2 mb-2 text-sm rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
    {message.text}
  </div>
)}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="XXXXXX"
          className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          maxLength={6}
        />
        <div className="text-sm text-gray-500 mb-4">
          Expires in: <span className="font-bold text-red-500">{timer}s</span>
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default OTPModal;