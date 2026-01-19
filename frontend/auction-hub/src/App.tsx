
// import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/signup';
import Login from './pages/login';
import AuthCallback from './pages/authCallback';
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from './pages/admin/AdminDashboard';
import { Suspense, lazy } from 'react';
import Dashboard from './pages/dashboard';
import { PublicRoute, PrivateRoute, AdminRoute } from './components/RouteGuards';
import AuctionProductDetails from './pages/user/AuctionProductDetails';
import UserManagement from './pages/admin/UserManagement';
import { AdminLayout } from './pages/admin/AdminLayout';



const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))

function App() {

  return (
    <>
      <Suspense fallback={<div className='flex h-screen items-center justify-center' >
        Loading...
      </div>} >
        <Routes>
          <Route path='/' element={<Navigate to='login' replace />} />
          <Route path='/signup' element={
            <PublicRoute><Signup /></PublicRoute>
          } />
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

          <Route path="auction/:id" element={
            <PrivateRoute><AuctionProductDetails /></PrivateRoute>
          } />

          <Route path="admin/login" element={
            <PublicRoute><AdminLogin /></PublicRoute>
          } />


          <Route path='/admin' element={<AdminLayout />}>
            <Route path="dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="users" element={
              <AdminRoute><UserManagement /></AdminRoute>
            } />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>

      </Suspense>
      <Toaster position="top-right" />
    </>
  )
}

export default App
