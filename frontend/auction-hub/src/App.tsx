
// import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import AuthCallback from './pages/authCallback';
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from './pages/admin/AdminDashboard';
import { Suspense,lazy } from 'react';
import Dashboard from './pages/dashboard';
import { PublicRoute, PrivateRoute,AdminRoute } from './components/RouteGuards';



const ForgotPassword=lazy(()=>import ("./pages/ForgotPassword"))

function App() {  

  return (
    <>
    <Suspense fallback={<div className='flex h-screen items-center justify-center' >
      Loading...
    </div>} >
      <Routes>
        <Route path='/' element={<Navigate to ='login' replace/>} />
        <Route path='/signup' element={
          <PublicRoute><Signup/></PublicRoute>
          } />
        <Route path='login' element={
           <PublicRoute><Login/></PublicRoute>
          } />
        <Route path='/forgot-password' element ={
          <PublicRoute><ForgotPassword /></PublicRoute>
          }/>
        <Route path='/auth/callback' element={<AuthCallback/>} />
        <Route path='/user/dashboard' element={
          <PrivateRoute><Dashboard/></PrivateRoute> 
          } />
        <Route path="admin/login" element={
         <PublicRoute><AdminLogin/></PublicRoute> 
          } />
        <Route path="admin/dashboard" element={
          <AdminRoute><AdminDashboard/></AdminRoute> 
           } />
      </Routes>

    </Suspense>
    </>
  )
}

export default App
