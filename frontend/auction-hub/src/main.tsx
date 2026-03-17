import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { Store } from './redux/store.ts'
import { BrowserRouter } from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'


createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >

  <StrictMode>
    <Provider store={Store} >
      <BrowserRouter>
        <App />
      
      </BrowserRouter>

    </Provider>
  </StrictMode>,
  </GoogleOAuthProvider>
)
