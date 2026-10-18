import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import 'daisyui/themes.css'
import App from './App.jsx'

// Base URL: Production backend on Render or local proxy in development
axios.defaults.baseURL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'https://mernprac.onrender.com')

// Har request ke saath login token bhejo
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // apni key ka naam check karo
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)