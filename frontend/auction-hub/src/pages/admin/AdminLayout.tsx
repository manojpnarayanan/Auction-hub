import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import NotificationBell from "../../components/Notification";
import {ROUTES} from '../../Constants/routes';


export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-[#0d1117] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <span className="font-bold text-blue-500 text-xl">⚡</span>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">AuctionHub<span className="text-blue-500">Admin</span></span>
        </div>
        
        <nav className="flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition-colors ${location.pathname === item.path
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <NotificationBell/>
          {user && <span className="text-sm text-gray-400 hidden md:block">Hi, {user.name}</span>}
          <div className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-bold py-2 px-4 rounded-md transition cursor-pointer">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}