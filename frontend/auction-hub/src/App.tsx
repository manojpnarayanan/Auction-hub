
// import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import AuthCallback from './pages/authCallback';

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to ='login' replace/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='login' element={<Login/>} />
        <Route path='/auth/callback' element={<AuthCallback/>} />
      </Routes>
    </>
  )
}

export default App
