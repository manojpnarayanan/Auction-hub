import {Link,useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./Notification";


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
        {/* <div className="hidden lg:flex items-center bg-white/20 rounded-full px-4 py-1.5 border border-white/30 focus-within:bg-white focus-within:text-gray-800 transition mx-4">
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchText || ""}
            onChange={(e) => setSearchText && setSearchText(e.target.value)}
            disabled={!setSearchText}
            className="bg-transparent border-none outline-none text-sm ml-2 placeholder-white/70 text-white w-64 focus:text-gray-800 focus:placeholder-gray-400 disabled:opacity-50"
          />
        </div> */}
        {/* Search Bar (Only shows if on Dashboard) */}
{location.pathname === "/user/dashboard" && (
  <div className="hidden lg:flex items-center bg-white/20 rounded-full px-4 py-1.5 border border-white/30 focus-within:bg-white focus-within:text-gray-800 transition mx-4">
    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search auctions..."
      value={searchText || ""}
      onChange={(e) => setSearchText && setSearchText(e.target.value)}
      className="bg-transparent border-none outline-none text-sm ml-2 placeholder-white/70 text-white w-64 focus:text-gray-800 focus:placeholder-gray-400"
    />
  </div>
)}

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
            <Link to="/watchlist" className={`hover:text-white/80 transition ${isActive('/user/profile')}`}>
              Watchlist
            </Link>
          </nav>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-4">
         <NotificationBell/>
          <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/50 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2500" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}