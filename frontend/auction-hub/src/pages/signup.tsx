import { useState } from "react";
import { signup } from "../api/auth";


export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(form)
      setMsg(res.data.message);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#1da1f2] text-white py-3 px-4 md:px-6 flex flex-wrap justify-between items-center shadow-md z-1">
        <h1 className="text-2xl md:text-3xl font-bold italic" style={{ fontFamily: "cursive" }}>Auction Hub</h1>
        <nav className="flex items-center gap-4 md:gap-6 mt-2 md:mt-0">
          <a href="#about" className="text-white hover:text-gray-100 font-medium text-sm md:text-base">About</a>
          <a href="#contact" className="text-white hover:text-gray-100 font-medium text-sm md:text-base">Contact</a>
          <button className="bg-white text-[#1da1f2] px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-sm md:text-base hover:bg-gray-100 transition-colors shadow-sm">
            Log In
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800">
            Create Your Account
          </h2>

          <div className="bg-transparent">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 ml-1 text-sm md:text-base">Full Name</label>
                <input
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1da1f2] bg-white text-sm md:text-base transition-shadow shadow-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 ml-1 text-sm md:text-base">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1da1f2] bg-white text-sm md:text-base transition-shadow shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 ml-1 text-sm md:text-base">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1da1f2] bg-white text-sm md:text-base transition-shadow shadow-sm"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 ml-1 text-sm md:text-base">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1da1f2] bg-white text-sm md:text-base transition-shadow shadow-sm"
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-[#1da1f2] text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-500 transition-colors shadow-md hover:shadow-lg mt-2 transform active:scale-[0.98] duration-200"
              >
                Sign Up
              </button>

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/user/auth/google'}
                className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform active:scale-[0.98] duration-200"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.36c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </button>

              <div className="space-y-2 mt-6">
                <p className="text-center text-sm text-gray-500">
                  Please verify your email after signing up.
                </p>
                <p className="text-center text-sm text-gray-500">
                  Already have an account? <a href="#login" className="text-[#1da1f2] font-semibold hover:underline">Log In</a>
                </p>
              </div>

              {msg && (
                <div className={`text-center p-3 rounded ${msg.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}