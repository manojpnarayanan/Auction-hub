
// import './App.css';
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
          {/* <Route path='/' element={<Navigate to='login' replace />} /> */}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={
            <PublicRoute><Signup /></PublicRoute>
          } />
          <Route path='auctions' element={<Auctions />} />
          <Route path='login' element={
            <PublicRoute><Login /></PublicRoute>
          } />

          <Route path='/forgot-password' element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route path='/user/dashboard' element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path='/user/my-bids' element={
            <PrivateRoute><MyBids /></PrivateRoute>
          } />
          <Route path="/user/my-listings" element={
            <PrivateRoute><MyListings /></PrivateRoute>
          } />
          <Route path="/user/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path='subscription-plans' element={
            <PrivateRoute><SubscriptionPlans/></PrivateRoute>
          } >

          </Route>

          <Route path="auction/:id" element={
            <AuctionProductDetails />
          } />
          <Route path='/watchlist' element={
            <PrivateRoute><Watchlist/></PrivateRoute>
          }>

          </Route>

          <Route path="admin/login" element={
            <PublicRoute><AdminLogin /></PublicRoute>
          } />
          <Route path='live-auction/:id' element={
            <PrivateRoute><LiveAuctionRoom/></PrivateRoute>
          } >
          </Route>


          <Route path='/admin' element={<AdminLayout />}>
            <Route path="dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="users" element={
              <AdminRoute><UserManagement /></AdminRoute>
            } />
            <Route path="categories" element={
              <AdminRoute><AdminCategories /></AdminRoute>
            } >
            </Route>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path='auctions' element={
              <AdminRoute><AdminAuctions /></AdminRoute>
            } />
            <Route path='wallet' element={
              <AdminRoute><AdminWallet /></AdminRoute>
            } />
            <Route path='subscription-plans' element={
              <AdminRoute><AdminSubscriptionPlan /></AdminRoute>
            } />
            <Route path='disputes' element={
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
