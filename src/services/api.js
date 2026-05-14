import axios from 'axios'

const getBaseURL = () => {
  // If explicitly set via environment variable, always use that
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Fallback based on mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }

  // Production fallback — Render backend URL
  return 'https://scentora-backend-bwfc.onrender.com/api'
}

const API_URL = getBaseURL()

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor — handle 401 globally (session expired / unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

