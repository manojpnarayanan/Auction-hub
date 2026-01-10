
// import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import AuthCallback from './pages/authCallback';
import { Suspense,lazy } from 'react';
import Dashboard from './pages/dashboard';


const ForgotPassword=lazy(()=>import ("./pages/ForgotPassword"))

function App() {  

  return (
    <>
    <Suspense fallback={<div className='flex h-screen items-center justify-center' >
      Loading...
    </div>} >
      <Routes>
        <Route path='/' element={<Navigate to ='login' replace/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='login' element={<Login/>} />
        <Route path='/auth/callback' element={<AuthCallback/>} />
        <Route path='/forgot-password' element ={<ForgotPassword/>}/>
        <Route path='/user/dashboard' element={<Dashboard/>} />
      </Routes>

    </Suspense>
    </>
  )
}

export default App
