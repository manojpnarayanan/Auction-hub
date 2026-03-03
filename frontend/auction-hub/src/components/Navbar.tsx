import {Link,useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

interface NavbarProps{
    searchText?:string,
    setSearchText?:(text:string)=>void;
}

export default function Navbar({searchText, setSearchText} : NavbarProps){
    const location=useLocation();
    const isActive=(path:string)=>{
        return location.pathname===path? "text-white underline decoration-2 underline-offset-4" : "text-white/90";
    }
    return (
    <header className="bg-[#1da1f2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Search Bar (Only shows if setSearchText is provided) */}
        <div className="hidden lg:flex items-center bg-white/20 rounded-full px-4 py-1.5 border border-white/30 focus-within:bg-white focus-within:text-gray-800 transition mx-4">
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchText || ""}
            onChange={(e) => setSearchText && setSearchText(e.target.value)}
            disabled={!setSearchText}
            className="bg-transparent border-none outline-none text-sm ml-2 placeholder-white/70 text-white w-64 focus:text-gray-800 focus:placeholder-gray-400 disabled:opacity-50"
          />
        </div>
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold italic" style={{ fontFamily: "cursive" }}>Auction Hub</h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/user/dashboard" className={`hover:text-white/80 transition ${isActive('/user/dashboard')}`}>
              Home
            </Link>
            {/* <Link to="/user/dashboard" className="text-white/90 hover:text-white/80">
              Categories
            </Link> */}
            <Link to="/user/my-bids" className={`hover:text-white/80 transition ${isActive('/user/my-bids')}`}>
              My Bids
            </Link>
            <Link to="/user/my-listings" className={`hover:text-white/80 transition ${isActive('/user/my-listings')}`}>
              My Listings
            </Link>
            <Link to="/user/profile" className={`hover:text-white/80 transition ${isActive('/user/profile')}`}>
              Profile
            </Link>
            <Link to="/subscription-plans" className={`hover:text-white/80 transition ${isActive('/user/profile')}`}>
              Plans
            </Link>
          </nav>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="text-white hover:bg-white/10 p-2 rounded-full transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/50 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2500" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}