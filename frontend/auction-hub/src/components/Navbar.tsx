import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./Notification";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { ROUTES } from '../Constants/routes';
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

interface NavbarProps {
    searchText?: string,
    setSearchText?: (text: string) => void;
}

export default function Navbar({ searchText, setSearchText }: NavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    
    const user = useSelector((state: RootState) => state.auth.user);

    const isActive = (path: string) => {
        return location.pathname === path ? "text-white underline decoration-2 underline-offset-4" : "text-white/90";
    }

    const navLinks = [
        { name: "Home", path: ROUTES.USER.DASHBOARD },
        { name: "My Bids", path: ROUTES.USER.MY_BIDS },
        { name: "My Listings", path: ROUTES.USER.MY_LISTINGS },
        { name: "Profile", path: ROUTES.USER.PROFILE },
        { name: "Plans", path: ROUTES.SUBSCRIPTION_PLANS },
        { name: "Watchlist", path: ROUTES.WATCHLIST },
    ];

    return (
        <header className="bg-[#1da1f2] text-white py-3 px-6 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4 md:gap-8">
                    {/* Hamburger for Mobile */}
                    {user && (
                        <button 
                            className="md:hidden p-1 hover:bg-white/10 rounded-lg transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}

                    <h1 
                        onClick={() => navigate(ROUTES.HOME)} 
                        className="text-xl md:text-2xl font-bold italic cursor-pointer truncate" 
                        style={{ fontFamily: "cursive" }}
                    >
                        Auction Hub
                    </h1>

                    {/* Desktop Nav */}
                    {user && (
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            {navLinks.map(link => (
                                <Link 
                                    key={link.path} 
                                    to={link.path} 
                                    className={`hover:text-white/80 transition ${isActive(link.path)}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Search - Desktop */}
                {location.pathname === ROUTES.USER.DASHBOARD && (
                    <div className="hidden lg:flex items-center bg-white/20 rounded-full px-4 py-1.5 border border-white/30 focus-within:bg-white focus-within:text-gray-800 transition mx-4">
                        <Search className="w-4 h-4 text-white/70" />
                        <input
                            type="text"
                            placeholder="Search auctions..."
                            value={searchText || ""}
                            onChange={(e) => setSearchText && setSearchText(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm ml-2 placeholder-white/70 text-white w-64 focus:text-gray-800 focus:placeholder-gray-400"
                        />
                    </div>
                )}

                {/* Right Side Icons */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile Search Toggle */}
                    {user && location.pathname === ROUTES.USER.DASHBOARD && (
                        <button 
                            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition"
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            <Search size={20} />
                        </button>
                    )}

                    {user ? (
                        <>
                            <NotificationBell />
                            <div 
                                onClick={() => navigate(ROUTES.USER.PROFILE)}>
                                {/* <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2500" alt="Profile" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="hidden sm:block">
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4">
                            <button 
                                onClick={() => navigate(ROUTES.LOGIN)} 
                                className="text-xs md:text-sm font-bold hover:text-white/80 transition px-2"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => navigate(ROUTES.SIGNUP)} 
                                className="bg-white text-[#1da1f2] px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-black shadow-sm hover:bg-gray-100 transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar - Revealed on toggle */}
            {showMobileSearch && location.pathname === ROUTES.USER.DASHBOARD && (
                <div className="lg:hidden mt-3 px-2 transition-all">
                    <div className="flex items-center bg-white rounded-xl px-4 py-2 border border-gray-200">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search auctions..."
                            value={searchText || ""}
                            onChange={(e) => setSearchText && setSearchText(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm ml-2 text-gray-800 w-full"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Mobile Navigation Menu - Revealed on Hamburger */}
            {isMenuOpen && user && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#1da1f2] border-t border-white/10 shadow-xl overflow-hidden animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col py-4">
                        {navLinks.map(link => (
                            <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-6 py-4 text-lg font-medium hover:bg-white/10 transition border-b border-white/5 last:border-none ${location.pathname === link.path ? "bg-white/10" : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="px-6 py-4 mt-2 sm:hidden border-t border-white/10">
                            <LogoutButton />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

