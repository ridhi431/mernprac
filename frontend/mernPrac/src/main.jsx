import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

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