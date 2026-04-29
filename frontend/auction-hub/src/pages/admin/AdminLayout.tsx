import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import NotificationBell from "../../components/Notification";
import { ROUTES } from '../../Constants/routes';
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const navItems = [
    { name: "Dashboard", path: ROUTES.ADMIN.DASHBOARD },
    { name: "Auctions", path: ROUTES.ADMIN.AUCTIONS },
    { name: "Users", path: ROUTES.ADMIN.USERS },
    { name: "Categories", path: ROUTES.ADMIN.CATEGORIES },
    { name: "Wallet", path: ROUTES.ADMIN.WALLET },
    { name: "Subscriptions", path: ROUTES.ADMIN.SUBSCRIPTIONS },
    { name: "Disputes", path: ROUTES.ADMIN.DISPUTES },
  ]

  const NavButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map(item => (
        <button
          key={item.name}
          onClick={() => {
            navigate(item.path);
            if (mobile) setIsMenuOpen(false);
          }}
          className={`text-sm font-medium transition-colors text-left ${mobile ? "py-4 px-6 border-b border-gray-800 last:border-none" : ""} ${location.pathname === item.path
            ? "text-white"
            : "text-gray-400 hover:text-gray-200"
            }`}
        >
          {item.name}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-8 py-5 bg-[#0d1117] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          
          <button 
            className="md:hidden p-1 hover:bg-gray-800 rounded transition mr-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="w-7 h-7 bg-blue-600/20 rounded flex items-center justify-center border border-blue-500/30">
            <span className="font-bold text-blue-500 text-lg">⚡</span>
          </div>
          <span className="text-white font-bold text-md md:text-lg tracking-wide whitespace-nowrap">
            AuctionHub<span className="text-blue-500">Admin</span>
          </span>
        </div>
        
        
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 mx-4 overflow-x-auto scrollbar-hide">
          <NavButtons />
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <NotificationBell/>
          {user && <span className="text-sm text-gray-400 hidden lg:block">Hi, {user.name.split(' ')[0]}</span>}
          <div className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-bold py-2 px-3 md:px-4 rounded-md transition cursor-pointer">
            <LogoutButton />
          </div>
        </div>
      </header>

      
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] z-40 flex flex-col bg-[#0d1117] border-t border-gray-800 animate-in slide-in-from-left duration-300">
          <nav className="flex flex-col">
            <NavButtons mobile />
          </nav>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
