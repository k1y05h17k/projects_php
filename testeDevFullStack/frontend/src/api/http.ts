import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL as string
const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'app_token'

export const http = axios.create({ baseURL: API_URL })

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)
