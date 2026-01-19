import { useState, useEffect } from "react";
import { signup } from "../api/auth";
import OTPModal from "../components/OTPModal";
import { useNavigate } from "react-router-dom";
import  type { SignupCredentials } from "../types/auth";

export default function Signup() {
  // const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [form,setForm]=useState<SignupCredentials &{confirmPassword:string} >({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });
  const [msg, setMsg] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("otpEmail");
    const savedExpiry = localStorage.getItem("otpExpiry");
    if (savedEmail && savedExpiry) {
      const remaining = parseInt(savedExpiry) - Date.now();
      if (remaining > 0) {
        setEmailForOTP(savedEmail);
        setShowOTP(true);
      } else {
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("otpExpiry");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    console.log("Validation form",form);
    // --- NEW VALIDATION START ---
    if (!form.name || !form.email || !form.password || !form.confirmPassword){
      setMsg("Please fill all Fields");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/;
    if (!strongPasswordRegex.test(form.password)) {
      setMsg("Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number");
      setLoading(false);
      return;
    }

    if (form.name.trim().length < 2) {
      setMsg("Name must be at least 2 characters");
      setLoading(false);
      return;
    }
    const nameRegex=/^[a-zA-Z]+$/
    if (!nameRegex.test(form.name.trim())) {
      setMsg("Name must contain only alphabets (No spaces or numbers)");
      setLoading(false);
      return;
    }

    // --- NEW VALIDATION END ---

    try {
      await signup(form);
      localStorage.setItem("otpEmail", form.email);
      setEmailForOTP(form.email);
      setShowOTP(true);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setMsg("✅ Verified! Redirecting to Login...");
    localStorage.removeItem("otpEmail");
    localStorage.removeItem("otpExpiry");
    setShowOTP(false);
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* --- Compact Header --- */}
      <header className="flex-none w-full bg-[#1da1f2] text-white py-2 px-4 shadow-md z-40 flex justify-between items-center">
        <h1 className="text-xl font-bold italic" style={{ fontFamily: "cursive" }}>Auction Hub</h1>
        <nav className="flex items-center gap-4">
          <a href="#about" className="text-white/90 hover:text-white text-sm font-medium">About</a>
          <a href="#contact" className="text-white/90 hover:text-white text-sm font-medium">Contact</a>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-[#1da1f2] px-4 py-1 rounded-full font-bold text-xs hover:bg-gray-100 transition-colors shadow-sm"
          >
            Log In
          </button>
        </nav>
      </header>

      {/* --- Main Content (Centered & Compact) --- */}
      <div className="flex-grow flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-purple-900/80 backdrop-blur-sm"></div>

        <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

          <div className="px-6 pt-5 pb-2 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-3">

              {msg && (
                <div className={`p-2 rounded text-center text-xs font-bold ${msg.includes("Error") ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}>
                  {msg}
                </div>
              )}

              {/* Fields */}
              <div className="space-y-2">
                <input
                  type="text" placeholder="Full Name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#1da1f2] outline-none"
                />

                <input
                  type="email" placeholder="Email Address"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#1da1f2] outline-none" 
                />

                {[{ key: "password", val: form.password, show: showPassword, set: setShowPassword, ph: "Password" },
                { key: "confirmPassword", val: form.confirmPassword, show: showConfirmPassword, set: setShowConfirmPassword, ph: "Confirm Password" }
                ].map((field) => (
                  <div key={field.key} className="relative">
                    <input
                      type={field.show ? "text" : "password"} placeholder={field.ph}
                      value={field.val} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#1da1f2] outline-none pr-8"
                    />
                    <button type="button" onClick={() => field.set(!field.show)} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                      {field.show ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-1 space-y-2">
                <button type="submit" disabled={loading} className={`w-full py-2.5 rounded-lg text-white font-bold text-sm shadow transition-all ${loading ? "bg-gray-400" : "bg-[#1da1f2] hover:bg-blue-500 hover:-translate-y-0.5"}`}>
                  {loading ? "Sending..." : "Sign Up"}
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-2 text-gray-300 text-[10px] uppercase">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button type="button" onClick={() => window.location.href = 'http://localhost:3000/user/auth/google'} className="w-full bg-white border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" /><path d="M12 4.36c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </button>
              </div>

              <div className="text-center mt-2">
                <a href="/login" className="text-xs text-[#1da1f2] font-bold hover:underline">Already have an account? Log in</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showOTP && <OTPModal email={emailForOTP} onClose={() => setShowOTP(false)} onSuccess={handleOTPSuccess} />}
    </div>
  );
}