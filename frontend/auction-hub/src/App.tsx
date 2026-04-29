import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/signup';
import Login from './pages/login';
import Home from './pages/user/Home';
import Auctions from './pages/user/Auctions';
import AuthCallback from './pages/authCallback';
import AdminLogin from "./pages/admin/AdminLogin"
import AdminAuctions from './pages/admin/AdminAuctionManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Suspense, lazy, useEffect } from 'react';
import { socket } from './utils/socket';
import Dashboard from './pages/dashboard';
import { PublicRoute, PrivateRoute, AdminRoute } from './components/RouteGuards';
import AuctionProductDetails from './pages/user/AuctionProductDetails';
import UserManagement from './pages/admin/UserManagement';
import { AdminLayout } from './pages/admin/AdminLayout';
import AdminCategories from './pages/admin/AdminCategories';
import MyBids from './pages/user/MyBids';
import MyListings from './pages/user/MyListings';
import Profile from './pages/user/Profile';
import AdminWallet from './pages/admin/AdminWallet';
import AdminSubscriptionPlan from './pages/admin/AdminSubscriptionPlan';
import SubscriptionPlans from './pages/user/SubscriptionPlans';
import LiveAuctionRoom from './pages/user/LiveAuctionRoom';
import Watchlist from './pages/user/Watchlist';
import AdminDisputes from './pages/admin/AdminDispute';
import {ROUTES} from './Constants/routes';

const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))

function App() {

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to Socket.io :Server", socket.id)

    });
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <Suspense fallback={<div className='flex h-screen items-center justify-center' >
        Loading...
      </div>} >
        <Routes>
          
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SIGNUP} element={
            <PublicRoute><Signup /></PublicRoute>
          } />
          <Route path={ROUTES.AUCTIONS} element={<Auctions />} />
          <Route path={ROUTES.LOGIN} element={
            <PublicRoute><Login /></PublicRoute>
          } />

          <Route path={ROUTES.FORGOT_PASSWORD} element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
          <Route path={ROUTES.USER.DASHBOARD} element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path={ROUTES.USER.MY_BIDS} element={
            <PrivateRoute><MyBids /></PrivateRoute>
          } />
          <Route path={ROUTES.USER.MY_LISTINGS} element={
            <PrivateRoute><MyListings /></PrivateRoute>
          } />
          <Route path={ROUTES.USER.PROFILE} element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path={ROUTES.SUBSCRIPTION_PLANS} element={
            <PrivateRoute><SubscriptionPlans/></PrivateRoute>
          } >

          </Route>

          <Route path={ROUTES.AUCTION_DETAILS} element={
            <AuctionProductDetails />
          } />
          <Route path={ROUTES.WATCHLIST} element={
            <PrivateRoute><Watchlist/></PrivateRoute>
          }>

          </Route>

          <Route path={ROUTES.ADMIN.LOGIN} element={
            <PublicRoute><AdminLogin /></PublicRoute>
          } />
          <Route path={ROUTES.LIVE_AUCTION} element={
            <PrivateRoute><LiveAuctionRoom/></PrivateRoute>
          } >
          </Route>


          <Route path={ROUTES.ADMIN.LAYOUT} element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN.DASHBOARD} element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path={ROUTES.ADMIN.USERS}element={
              <AdminRoute><UserManagement /></AdminRoute>
            } />
            <Route path={ROUTES.ADMIN.CATEGORIES} element={
              <AdminRoute><AdminCategories /></AdminRoute>
            } >
            </Route>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path={ROUTES.ADMIN.AUCTIONS} element={
              <AdminRoute><AdminAuctions /></AdminRoute>
            } />
            <Route path={ROUTES.ADMIN.WALLET} element={
              <AdminRoute><AdminWallet /></AdminRoute>
            } />
            <Route path={ROUTES.ADMIN.SUBSCRIPTIONS} element={
              <AdminRoute><AdminSubscriptionPlan /></AdminRoute>
            } />
            <Route path={ROUTES.ADMIN.DISPUTES} element={
              <AdminRoute><AdminDisputes/></AdminRoute>
            } >

            </Route>

          </Route>
        </Routes>

      </Suspense>
      <Toaster position="top-right" />
    </>
  )
}

export default App
